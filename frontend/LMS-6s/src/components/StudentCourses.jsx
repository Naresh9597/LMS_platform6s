import React, { useEffect, useState } from "react";

export default function StudentCourses() {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);

  // Fetch courses from backend
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
  try {
    // Fetch all courses
    const resCourses = await fetch("http://localhost:4000/api/courses");
    const allCourses = await resCourses.json();

    // Fetch enrolled courses
    const resEnrolled = await fetch("http://localhost:4000/api/student/courses/enrolled");
    const enrolled = await resEnrolled.json();

    // Fetch completed courses
    const resCompleted = await fetch("http://localhost:4000/api/student/courses/completed");
    const completed = await resCompleted.json();

    // Filter available courses (exclude enrolled + completed)
    const available = allCourses.filter(
      c => !enrolled.some(e => e.id === c.id) && !completed.some(e => e.id === c.id)
    );

    setAvailableCourses(available);
    setEnrolledCourses(enrolled);
    setCompletedCourses(completed);
  } catch (err) {
    console.error("Error fetching courses:", err.message);
  }
};

const handleEnroll = async (course) => {
  try {
    const res = await fetch(`http://localhost:4000/api/student/courses/enroll/${course.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      fetchCourses(); // ✅ refetch all courses
    }
  } catch (err) {
    console.error(err.message);
  }
};

const handleComplete = async (course) => {
  try {
    const res = await fetch(`http://localhost:4000/api/student/courses/complete/${course.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      fetchCourses(); // ✅ refetch all courses
    }
  } catch (err) {
    console.error(err.message);
  }
};


  return (
    <div className="space-y-6">
      {/* Available Courses */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Available Courses</h2>
        {availableCourses.length > 0 ? (
          <ul className="space-y-2">
            {availableCourses.map((course) => (
              <li
                key={course.id}
                className="flex justify-between p-2 border rounded"
              >
                {course.name}
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEnroll(course)}
                >
                  Enroll
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No courses available</p>
        )}
      </div>

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Enrolled Courses</h2>
        {enrolledCourses.length > 0 ? (
          <ul className="space-y-2">
            {enrolledCourses.map((course) => (
              <li
                key={course.id}
                className="flex justify-between p-2 border rounded"
              >
                {course.name}
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => handleComplete(course)}
                >
                  Mark Complete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No enrolled courses</p>
        )}
      </div>

      {/* Completed Courses */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Completed Courses</h2>
        {completedCourses.length > 0 ? (
          <ul className="space-y-2">
            {completedCourses.map((course) => (
              <li
                key={course.id}
                className="p-2 border rounded bg-gray-100"
              >
                {course.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No completed courses</p>
        )}
      </div>
    </div>
  );
}
