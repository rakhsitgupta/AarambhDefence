import { VscHome, VscMortarBoard, VscBook, VscFilePdf, VscTasklist, VscCalendar } from "react-icons/vsc";
import { ACCOUNT_TYPE } from './../src/utils/constants';

export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: VscHome,
    type: ACCOUNT_TYPE.INSTRUCTOR
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/instructor",
    icon: VscMortarBoard,
    type: ACCOUNT_TYPE.INSTRUCTOR
  },
  {
    id: 3,
    name: "My Courses",
    path: "/dashboard/my-courses",
    icon: VscBook,
    type: ACCOUNT_TYPE.INSTRUCTOR
  },
  {
    id: 4,
    name: "Add Course",
    path: "/dashboard/add-course",
    icon: VscBook,
    type: ACCOUNT_TYPE.INSTRUCTOR
  },
  {
    id: 5,
    name: "Add Mocktest",
    path: "/dashboard/add-mocktest",
    icon: VscFilePdf,
    type: ACCOUNT_TYPE.INSTRUCTOR
  },
  {
    id: 6,
    name: "Add Study Material",
    path: "/dashboard/add-study-material",
    icon: VscFilePdf,
    type: ACCOUNT_TYPE.INSTRUCTOR
  },
  {
    id: 7,
    name: "My Mocktests",
    path: "/dashboard/my-mocktests",
    icon: VscFilePdf,
    type: ACCOUNT_TYPE.INSTRUCTOR
  },
  {
    id: 8,
    name: "My Study Materials",
    path: "/dashboard/my-study-materials",
    icon: VscFilePdf,
    type: ACCOUNT_TYPE.INSTRUCTOR
  },
  {
    id: 9,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: VscHome,
    type: ACCOUNT_TYPE.STUDENT
  },
  {
    id: 10,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    icon: VscBook,
    type: ACCOUNT_TYPE.STUDENT
  },
  {
    id: 11,
    name: "Task Planner",
    path: "/dashboard/task-planner",
    icon: VscCalendar,
    type: ACCOUNT_TYPE.STUDENT
  },
  {
    id: 12,
    name: "Enrolled Mocktests",
    path: "/dashboard/enrolled-mocktests",
    icon: VscFilePdf,
    type: ACCOUNT_TYPE.STUDENT
  },
  {
    id: 13,
    name: "Enrolled Study Materials",
    path: "/dashboard/enrolled-study-materials",
    icon: VscFilePdf,
    type: ACCOUNT_TYPE.STUDENT
  },
  {
    id: 14,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: VscHome,
    type: ACCOUNT_TYPE.ADMIN
  },
  {
    id: 15,
    name: "Dashboard",
    path: "/dashboard/admin",
    icon: VscMortarBoard,
    type: ACCOUNT_TYPE.ADMIN
  },
  {
    id: 16,
    name: "Categories",
    path: "/dashboard/categories",
    icon: VscTasklist,
    type: ACCOUNT_TYPE.ADMIN
  }
];
