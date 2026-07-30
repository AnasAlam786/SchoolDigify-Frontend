// ProfileHeader.jsx

export default function ProfileHeader({
  student,
}) {

  const image = !student.IMAGE
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(student.STUDENTS_NAME)}`
    : student.IMAGE.startsWith("data:image")
      ? student.IMAGE
      : student.IMAGE.length > 500
        ? `data:image/jpeg;base64,${student.IMAGE}`
        : `https://lh3.googleusercontent.com/d/${student.IMAGE}=s200`;

  return (
    <div className="p-4 md:p-6 bg-gradient-to-b from-gray-800/30 to-transparent">
      <div className="flex flex-col items-center text-center">

        <div className="relative mb-4">
          <img src={image} alt={student.STUDENTS_NAME} className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-blue-500/30 shadow-xl object-cover" />
          <div className="absolute bottom-2 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            Roll: {student.ROLL}
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {student.STUDENTS_NAME}
        </h1>

        <div className="inline-flex items-center space-x-2 bg-gray-800/50 px-4 rounded-full mb-2">
          <i className="fas fa-graduation-cap text-blue-400"></i>
          <span className="text-gray-300 font-medium"> Class: {student.CLASS}</span>
        </div>

      </div>
    </div>
  );
}