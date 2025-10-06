import React, { useEffect, useState } from "react";

export default function StudentCourses() {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Fetch all courses
      const resCourses = await fetch("http://localhost:4000/api/courses");
      const allCourses = await resCourses.json();

      // Fetch student's enrolled courses
      const resEnrolled = await fetch("http://localhost:4000/api/student/enrolled");
      const enrolled = await resEnrolled.json();

      // Fetch student's completed courses
      const resCompleted = await fetch("http://localhost:4000/api/student/completed");
      const completed = await resCompleted.json();

      // Available = all courses - enrolled - completed
const available = allCourses.filter(
  c =>
    !enrolled.some(e => e._id === c._id || e.id == c._id) &&
    !completed.some(e => e._id === c._id || e.id == c._id)
);

      setAvailableCourses(available);
      setEnrolledCourses(enrolled);
      setCompletedCourses(completed);
    } catch (err) {
      console.error("Error fetching courses:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (course) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/student/enroll/${course._id}`,
        { method: "POST" }
      );
      if (res.ok) fetchCourses();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleComplete = async (course) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/student/complete/${course._id}`,
        { method: "POST" }
      );
      if (res.ok) fetchCourses();
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="space-y-6">
      {/* Available Courses */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Available Courses</h2>
        {availableCourses.length > 0 ? (
          <ul className="space-y-2">
            {availableCourses.map(course => (
              <li key={course._id} className="flex justify-between p-2 border rounded">
                <span>{course.title}</span>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => handleEnroll(course)}
                >
                  Enroll
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No courses available to enroll.</p>
        )}
      </section>

      {/* Enrolled Courses */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Enrolled Courses</h2>
        {enrolledCourses.length > 0 ? (
          <ul className="space-y-2">
            {enrolledCourses.map(course => (
              <li key={course._id} className="flex justify-between p-2 border rounded">
                <span>{course.title}</span>
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => handleComplete(course)}
                >
                  Mark Complete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">You have not enrolled in any courses yet.</p>
        )}
      </section>

      {/* Completed Courses */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Completed Courses</h2>
        {completedCourses.length > 0 ? (
          <ul className="space-y-2">
            {completedCourses.map(course => (
              <li
                key={course._id}
                className="p-2 border rounded bg-gray-100 text-gray-700"
              >
                {course.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">You have not completed any courses yet.</p>
        )}
      </section>
    </div>
  );
}
