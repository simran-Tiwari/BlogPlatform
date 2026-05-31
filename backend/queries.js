const Post = require("./models/PostModel");
const User = require("./models/UserModel");


// 1. Find posts with likes > 10
async function postsWithLikes() {
  return Post.find(
    { likes: { $gt: 10 } },
    "title likes createdAt"
  ).sort({ likes: -1 });
}

// 2. Find gmail users
async function gmailUsers() {
  return User.find({
    email: /@gmail\.com$/,
    role: "user",
  });
}

// 3. Posts with nodejs or mongodb tags
async function postsByTags() {
  return Post.find({
    tags: {
      $in: [/nodejs/i, /mongodb/i],
    },
  });
}

// 4. Increment likes by author
async function incrementLikes(authorId) {
  return Post.updateMany(
    { author: authorId },
    { $inc: { likes: 1 } }
  );
}

// 5. Delete old posts
async function deleteOldPosts() {
  const date = new Date();
  date.setDate(date.getDate() - 30);

  return Post.deleteMany({
    likes: 0,
    createdAt: { $lt: date },
  });
}

// 6. Post count per author
async function postCountPerAuthor() {
  return Post.aggregate([
    {
      $group: {
        _id: "$author",
        totalPosts: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $project: {
        totalPosts: 1,
        authorName: {
          $arrayElemAt: ["$author.name", 0],
        },
      },
    },
  ]);
}

// 7. Top 3 authors by likes
async function topAuthors() {
  return Post.aggregate([
    {
      $group: {
        _id: "$author",
        totalLikes: { $sum: "$likes" },
      },
    },
    { $sort: { totalLikes: -1 } },
    { $limit: 3 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "author",
      },
    },
  ]);
}

// 8. Monthly activity
async function monthlyActivity() {
  return Post.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);
}

// 9. Tag popularity
async function tagPopularity() {
  return Post.aggregate([
    { $unwind: "$tags" },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);
}

// 10. Authors with no posts
async function authorsWithoutPosts() {
  return User.aggregate([
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "author",
        as: "posts",
      },
    },
    {
      $match: {
        posts: { $eq: [] },
      },
    },
  ]);
}

module.exports = {
  postsWithLikes,
  gmailUsers,
  postsByTags,
  incrementLikes,
  deleteOldPosts,
  postCountPerAuthor,
  topAuthors,
  monthlyActivity,
  tagPopularity,
  authorsWithoutPosts,
};