import axios from "axios";
import { baseUrl } from "../config/config";
let courses = [
  {
    courseId: 1,
    courseName: "JavaScript",
    courseUrl: "javascript",
    chapters: [
      {
        chapterId: 1,
        chapterUrl: "introduction",
        chapterName: "Introduction"
      },
      {
        chapterId: 2,
        chapterUrl: "hello-world",
        chapterName: "Hello World"
      },
      {
        chapterId: 3,
        chapterUrl: "variables",
        chapterName: "Variables"
      },
      {
        chapterId: 4,
        chapterUrl: "datatypes",
        chapterName: "Datatypes"
      },
      {
        chapterId: 5,
        chapterUrl: "logical-operators",
        chapterName: "Logical Operators"
      },
      {
        chapterId: 6,
        chapterUrl: "if-condition",
        chapterName: "If Condition"
      },
      {
        chapterId: 7,
        chapterUrl: "arithmetic-operators",
        chapterName: "Arithmetic Operators"
      },
      {
        chapterId: 8,
        chapterUrl: "prototypes",
        chapterName: "Prototypes"
      },
      {
        chapterId: 9,
        chapterUrl: "function",
        chapterName: "Function"
      },
      {
        chapterId: 10,
        chapterUrl: "type-conversion",
        chapterName: "Type Conversion"
      },
      {
        chapterId: 11,
        chapterUrl: "arrow-functions",
        chapterName: "Arrow Functions"
      }
    ]
  },
  {
    courseId: 2,
    courseName: "Python",
    courseUrl: "python",
    chapters: [
      {
        chapterId: 1,
        chapterUrl: "introduction",
        chapterName: "Introduction"
      },
      {
        chapterId: 2,
        chapterUrl: "hello-world",
        chapterName: "Hello World"
      },
      {
        chapterId: 3,
        chapterUrl: "datatypes",
        chapterName: "Datatypes"
      },
      {
        chapterId: 4,
        chapterUrl: "if-condition",
        chapterName: "If-Condition"
      }
    ]
  }
];

async function addCourses() {
  // console.log("in add courses");
  axios
    .post(baseUrl, courses)
    .then((res) => console.log("sent courses", res.data))
    .catch((err) => console.log(err));
}
export { courses, addCourses };
