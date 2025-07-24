const User = require("../models/User");
const Subject = require("../models/Subject");

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().select("name email");

    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        const subjects = await Subject.find({ user: user._id });
        const totalBunked = subjects.reduce((sum, subject) => {
          return sum + (subject.total - subject.present);
        }, 0);

        return {
          _id: user._id,
          name: user.name,
          totalBunked,
          totalSubjects: subjects.length,
        };
      })
    );

    const sortedLeaderboard = leaderboardData
      .filter((user) => user.totalSubjects > 0)
      .sort((a, b) => b.totalBunked - a.totalBunked)
      .slice(0, 10);

    res.json(sortedLeaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

module.exports = { getLeaderboard };
