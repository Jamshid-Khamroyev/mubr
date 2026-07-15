import { FiUsers, FiBookOpen, FiBarChart2, FiMessageCircle, FiBell, FiFileText, FiBook } from "react-icons/fi";

const HomePage = () => {
  const schools = [{
    title: "1-son maktab",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    imagesId: ["img1", "img2"],
    adminPhone: "+998901234567",
    block: false,
    time: new Date("2024-09-01T10:00:00Z"),
    notification: [
      "663b8d1fcf6e3d9d20a3b041",
      "663b8d1fcf6e3d9d20a3b042"
    ],
    complaints: [
      "663b8d1fcf6e3d9d20a3b043"
    ],
    tests: [
      "663b8d1fcf6e3d9d20a3b044",
      "663b8d1fcf6e3d9d20a3b045"
    ],
    teams: [
      "663b8d1fcf6e3d9d20a3b046"
    ],
    localBooks: [
      "663b8d1fcf6e3d9d20a3b047"
    ],
    users: [
      "663b8d1fcf6e3d9d20a3b048",
      "663b8d1fcf6e3d9d20a3b049",
      "663b8d1fcf6e3d9d20a3b050"
    ],
    albums: [
      "663b8d1fcf6e3d9d20a3b051"
    ]
  }];
  
  const totalSchools = schools.length;
  const blockedSchools = schools.filter((s) => s.block).length;
  const totalUsers = schools.reduce((sum, s) => sum + s.users.length, 0);
  const totalTests = schools.reduce((sum, s) => sum + s.tests.length, 0);
  const totalTeams = schools.reduce((sum, s) => sum + s.teams.length, 0);
  const totalComplaints = schools.reduce((sum, s) => sum + s.complaints.length, 0);
  const totalNotifications = schools.reduce((sum, s) => sum + s.notification.length, 0);
  const totalAlbums = schools.reduce((sum, s) => sum + s.albums.length, 0);
  const totalBooks = schools.reduce((sum, s) => sum + s.localBooks.length, 0);

  const stats = [
    { title: "Umumiy maktablar", value: totalSchools, icon: <FiUsers />, color: "bg-blue-600" },
    { title: "Bloklangan maktablar", value: blockedSchools, icon: <FiUsers />, color: "bg-red-600" },
    { title: "Umumiy foydalanuvchilar", value: totalUsers, icon: <FiUsers />, color: "bg-green-600" },
    { title: "Testlar", value: totalTests, icon: <FiBookOpen />, color: "bg-indigo-600" },
    { title: "Jamoalar", value: totalTeams, icon: <FiUsers />, color: "bg-purple-600" },
    { title: "Fikrlar", value: totalComplaints, icon: <FiMessageCircle />, color: "bg-yellow-500" },
    { title: "Yangiliklar", value: totalNotifications, icon: <FiBell />, color: "bg-orange-500" },
    { title: "Foto albomlar", value: totalAlbums, icon: <FiFileText />, color: "bg-pink-500" },
    { title: "Mahalliy kitoblar", value: totalBooks, icon: <FiBook />, color: "bg-teal-600" },
  ];

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-slate-800 p-5 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className={`text-white text-3xl p-3 rounded-full ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-slate-300">{stat.title}</p>
              <h2 className="text-xl font-semibold">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
