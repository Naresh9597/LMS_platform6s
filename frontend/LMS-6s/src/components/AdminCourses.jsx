import React, { useEffect, useState } from "react";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");

  // Fetch courses from backend
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/courses");
      const data = await res.json();
      if (res.ok) setCourses(data);
      else console.error(data.error);
    } catch (err) {
      console.error("Error fetching courses:", err.message);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse.trim()) return; // prevent empty titles
    try {
      const res = await fetch("http://localhost:4000/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newCourse }),
      });
      if (res.ok) {
        setNewCourse("");
        fetchCourses(); // refresh after adding
      } else {
        const errorData = await res.json();
        console.error("Error adding course:", errorData.error);
      }
    } catch (err) {
      console.error("Error adding course:", err.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/courses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchCourses(); // refresh after delete
      else {
        const errorData = await res.json();
        console.error("Error deleting course:", errorData.error);
      }
    } catch (err) {
      console.error("Error deleting course:", err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Courses */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Courses Available</h2>
        {courses.length > 0 ? (
          <ul className="space-y-2">
            {courses.map((course) => (
              <li
                key={course._id} // use MongoDB _id as key
                className="flex justify-between p-2 border rounded"
              >
                {course.title} {/* show title */}
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDeleteCourse(course._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No courses available</p>
        )}
      </div>

      {/* Add New Course */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Add New Course</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Course title"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            className="border px-2 py-1 rounded flex-1"
          />
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded"
            onClick={handleAddCourse}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
