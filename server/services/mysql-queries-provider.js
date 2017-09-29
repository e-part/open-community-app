/**
 * Created by yotam on 30/08/2016.
 */

var mySqlQueriesProvider = {

  topCommentingMKByCategory : "SELECT \n"+
  " u.*, IFNULL(comments_counts.count, 0) as commentsCount\n"+
  "FROM\n"+
  " user u\n"+
  " INNER JOIN\n"+
  " RoleMapping r ON u.id = r.principalId\n"+
  " JOIN\n"+
  " Role ON r.roleId = Role.id\n"+
  " AND Role.name = ? \n"+
  " JOIN\n"+
  " (SELECT \n"+
  " c.creatorId, COUNT(p.id) count\n"+
  " FROM\n"+
  " Post p\n"+
  " JOIN CategoryPost cp ON cp.postId = p.id AND categoryId = ? \n"+
  " JOIN Comment c ON c.postId = p.id\n"+
  " GROUP BY creatorId) AS comments_counts ON comments_counts.creatorId = u.id\n"+
  "ORDER BY count DESC LIMIT ?;",

  mostUpvotedByCategory : "SELECT \n"+
  " IFNULL(upvotedCount.count, 0) as upvotedCount,\n"+
  " IFNULL(comments_counts.count, 0) as comments_counts,\n"+
  " u.*\n"+
  " FROM\n"+
  " user u\n"+
  " INNER JOIN\n"+
  " RoleMapping r ON u.id = r.principalId\n"+
  " JOIN\n"+
  " Role ON r.roleId = Role.id\n"+
  " AND Role.name != \'mk\'" +
  " JOIN\n"+
  " (SELECT \n"+
  " creatorId, COUNT(c.creatorId) count \n"+
  " FROM\n"+
  " Post p\n"+
  " JOIN CategoryPost cp ON cp.postId = p.id AND p.customerId = ? AND categoryId = ?\n"+
  " JOIN Comment c ON c.postId = p.id\n"+
  " GROUP BY c.creatorId) AS comments_counts ON comments_counts.creatorId = u.id\n"+
  " LEFT JOIN"+
  " (SELECT \n"+
  " u.userId, COUNT(u.id) count, c.creatorId \n"+
  " FROM\n"+
  " Post p\n"+
  " JOIN CategoryPost cp ON cp.postId = p.id AND p.customerId = ? AND categoryId = ?\n"+
  " JOIN Comment c ON c.postId = p.id\n"+
  " JOIN Upvote u ON c.id=u.commentId\n"+
  " GROUP BY c.creatorId) AS upvotedCount ON upvotedCount.creatorId = u.id\n"+
  " ORDER BY upvotedCount DESC, comments_counts DESC LIMIT ?;",

  topCommentingUserByRole : "SELECT \n"+
  " u.*, IFNULL(comments_counts.count, 0) as commentsCount\n"+
  "FROM\n"+
  " user u\n"+
  " INNER JOIN\n"+
  " RoleMapping r ON u.id = r.principalId\n"+
  " JOIN\n"+
  " Role ON r.roleId = Role.id\n"+
  " AND Role.name = ? \n"+
  " JOIN\n"+
  " (SELECT \n"+
  " c.creatorId, COUNT(p.id) count\n"+
  " FROM\n"+
  " Post p\n"+
  " JOIN Comment c ON c.postId = p.id AND p.customerId = ? \n"+
  " GROUP BY creatorId) AS comments_counts ON comments_counts.creatorId = u.id\n"+
  "ORDER BY count DESC LIMIT ?;",

  usersByCateories : "select u.* from user u\n"+
  "join \n"+
  "RoleMapping r\n"+
  "on u.id=r.principalId \n"+
  "join Role \n"+
  "on r.roleId=Role.id and Role.name= ? \n"+
  "join \n"+
  "userCategory uc\n"+
  "on u.id=uc.userId and uc.categoryId in (?) group by u.id;\n",

  // get all the active posts ordered by the user preference and date relevance.
  getTopPostsByUser : "select distinct p.id \n"+
  "from (select * from Post where reviewStatus='APPROVED' and status='PUBLISHED' and customerId=? \n" +
  "and migrationStatus = 'NORMAL' and endDate > UTC_TIMESTAMP()) p \n"+
  "left join\n"+
  "CategoryPost cp\n"+
  "on p.id = cp.postId \n"+
  "left join\n"+
  "userCategory uc\n"+
  "on uc.categoryId = cp.categoryId and userId=?  \n"+
  "order by uc.userId DESC, p.endDate ASC LIMIT ?,?;",

  // get the last posts that the user has commented on.
  getPostsByCommentingUser : "select p.*\n"+
  "from Post p\n"+
  "join\n"+
  "Comment c on \n"+
  "p.id = c.postId AND p.customerId = ? AND p.status=\'PUBLISHED\' \n"+
  "and p.migrationStatus = \'NORMAL\' AND c.deleted=0 AND c.creatorId = ? \n"+
  "group by p.id \n"+
  "order by p.endDate DESC LIMIT ?,?;",

  getPostsByCategories : "select distinct p.id from Post p \n"+
  "join CategoryPost cp\n"+
  "on p.id=cp.postId and p.customerId = ? and p.endDate > UTC_TIMESTAMP() and p.reviewStatus='APPROVED' and p.status='PUBLISHED' and cp.categoryId in (?)\n"+
  " order by p.endDate ASC LIMIT ?,?;",

  incrementPollAnswerVotes : "UPDATE PollAnswer SET votes = votes + 1 WHERE id = ?;",

  getPostsByMk : "SELECT * FROM \n"+
  "( select p.* from \n"+
  "Committeeuser cu \n"+
  "join user u \n"+
  "on u.id=cu.userId \n"+
  "join PostCommittee pc \n"+
  "on pc.committeeId=cu.committeeId \n"+
  "join Post p \n"+
  "on p.id=pc.postId \n"+
  "where cu.userId=? and p.isParent=0 \n"+
  "group by p.id \n"+
  "\n"+
  "union \n"+
  "\n"+
  "SELECT p.* FROM Postuser pu \n"+
  "join Post p \n"+
  "on p.id=pu.postId \n"+
  "where pu.userId=? and p.isParent=0 \n"+
  ") cp where customerId = ? AND reviewStatus='APPROVED' and status='PUBLISHED' AND endDate >= ? AND endDate <= ? limit ?,?; ",

  getAllMKsForInvitations : "select u.* from user u \n"+
  "join \n"+
  "RoleMapping r \n"+
  "on u.id=r.principalId and u.lastName not in ('יעלון','מגל','ליברמן','כחלון','נהרי','פרוש','שלום') \n"+
  "join Role \n"+
  "on r.roleId=Role.id and Role.name = ? ;",

  getLatestCommentsByUniqueUsers : "SELECT * \n"+
  "FROM Comment \n"+
  "INNER JOIN \n"+
  "(SELECT creatorId,MAX(createdAt) as TopDate \n"+
  " FROM Comment where customerId = ? AND deleted=0 \n"+
  " GROUP BY creatorId) AS EachItem ON \n"+
  " EachItem.TopDate = Comment.createdAt AND  Comment.deleted=0 \n"+
  " AND EachItem.creatorId = Comment.creatorId order by Comment.createdAt desc limit ? ;",

  getPostsByCommittees : "select distinct p.id from Post p \n"+
  "join PostCommittee pc \n"+
  "on p.id=pc.postId \n"+
  "and p.customerId = ? and p.endDate >= ? and p.endDate <= ? and p.status=\'PUBLISHED\' and p.migrationStatus = 'NORMAL' \n"+
  "and pc.committeeId in (?) \n"+
  " order by p.endDate ASC LIMIT ?,?;"

};
// if you want to print a query to test it directly:
// console.log(mySqlQueriesProvider.getPostsByCommittees);
module.exports = mySqlQueriesProvider;

