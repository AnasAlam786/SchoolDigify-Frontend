import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "./components/Header";
import ControlPanel from "./components/ControlPanel";
import StaffStats from "./components/StaffStats";
import StaffList from "./components/StaffList";

import "./style/ShowStaff.css"
import { apiGet } from "../../api/api";
import { SkeletonLoader } from "./components/PageStatus";

function ShowStaff () {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);

  const [stats, setStats] = useState({
    total_staff: 0,
    teachers: 0,
    administrators: 0,
    support_staff: 0,
    total_classes: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const [roleFilter, setRoleFilter] = useState("");


  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);

        const response = await apiGet("/api/get_all_staff");

        if (!response.ok) {
          throw new Error("Failed to load staff.");
        }

        const data = await response.json();

        setTeachers(data.staff);
        setStats(data.summary);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const filteredTeachers = useMemo(() => {
    const search = searchValue.toLowerCase();

    return teachers.filter((teacher) => {
      const name = teacher.name?.toLowerCase() || "";
      const email = teacher.email?.toLowerCase() || "";
      const role = teacher.role?.toLowerCase() || "";

      const matchesSearch =
        name.includes(search) ||
        email.includes(search);

      const matchesRole =
        roleFilter === "" ||
        role.includes(roleFilter.toLowerCase());

      return matchesSearch && matchesRole;
    });
  }, [teachers, searchValue, roleFilter]);


  const resetFilters = () => {
    setSearchValue("");
    setRoleFilter("");
  };

  const handleDelete = (teacher) => {
    console.log("Delete:", teacher);

    // Your delete API
    // deleteStaff(teacher.TeachersLogin.id)
  };

  let mainContent = null;
  if (loading) {
    mainContent = <SkeletonLoader/>;
  } else if (error) {
    mainContent = (<div className="flex items-center justify-center h-screen text-red-500"> {error} </div>);
  } else {
    mainContent = (
    <>
      <StaffStats
        totalStaff={stats.total_staff}
        teachersCount={stats.teachers}
        administratorCount={stats.administrators}
        helperStaffCount={stats.support_staff}
      />

      <StaffList
        teachers={filteredTeachers}
        totalClasses={stats.total_classes}
        onResetFilters={resetFilters}
      />
    </>
    )
  }


  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">

      <Header />

      <ControlPanel
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      {mainContent}

    </div>
  );
};

export default ShowStaff;