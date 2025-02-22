import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Select from "react-select";
import styles from "./blogs.module.scss";
// import tagOptions from "../../utils/tags";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import PostService from "../../services/PostService";
import TagService from "../../services/TagService";

export default function Navbar() {
  const cookies = new Cookies();
  const userCookie = cookies.get("userNullcast");
  const router = useRouter();
  const [tag, setTag] = useState("");
  const [status, setStatus] = useState("");
  const [tagOptions, setTagOptions] = useState([]);

  const statusOptions = [
    { label: "ALL STATUS", value: "" },
    { label: "PENDING", value: "pending" },
    { label: "REJECTED", value: "rejected" },
    { label: "PUBLISHED", value: "published" },
    { label: "DRAFTED", value: "drafted" }
  ];

  useEffect(() => {
    getSettingsTags();
  }, []);

  /**
   * gets tags from db and sets the tags
   * options in label and value format
   * @author akhilalekha
   */
  async function getSettingsTags() {
    const res = await TagService.getTags();
    // console.log("get tags response", res);
    let resTagOptions = res.map((tag) => {
      return {
        label: `${tag.name.toUpperCase()}`,
        value: `${tag.name}`
      };
    });
    // setTagOptions;
    const allOption = {
      label: "ALL CATEGORY",
      value: ""
    };
    resTagOptions = [allOption, ...resTagOptions];
    // console.log({ resTagOptions });
    setTagOptions(resTagOptions);
  }

  const handleTagSelect = (e) => {
    const newTag = e.value;
    setTag(newTag);
    router.push({
      pathname: "/posts",
      query: { pageNo: 1, tag: newTag, status: status }
    });
  };

  const handleStatusSelect = (e) => {
    const newStatus = e.value;
    setStatus(newStatus);
    router.push({
      pathname: "/posts",
      query: { pageNo: 1, tag: tag, status: newStatus }
    });
  };

  const createPost = async (createThisPost) => {
    try {
      const { data } = await PostService.createPost(userCookie, createThisPost);
      const { post, msg } = data;
      // notify(msg);
      // console.log(post, msg);
      // console.log(post.primaryAuthor._id, userCookie.id);
      if (post.primaryAuthor._id === userCookie.id) {
        router.push({
          pathname: "/posts/write",
          query: { post_id: post._id }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddNewPost = () => {
    const newPost = {
      title: "[Untitled]",
      mobiledoc: {
        version: "0.3.1",
        atoms: [],
        cards: [],
        markups: [],
        sections: [],
        ghostVersion: "4.0"
      }
    };
    createPost(newPost);
  };

  return (
    <div className="bg-white flex flex-row items-center rounded shadow-sm h-sub-nav">
      <div className="flex flex-row justify-between items-center font-semibold h-full w-full md:px-5 px-3">
        <div className="cursor-pointer h-16 flex justify-center items-center relative">
          <span className="mt-1 text-gray-900">My Post</span>
          <div className="border border-b-4 border-gray-900 absolute bottom-0 left-0 w-full"></div>
        </div>
        <div className="flex items-center py-3">
          <Select
            options={tagOptions}
            // value={router.query.tag}
            isMulti={false}
            className={`basic-single postFilter m-0 outline-none focus:outline-none text-sm bg-gray-200 border rounded px-0 cursor-pointer md:mr-4 ${styles.min_w_10}`}
            classNamePrefix="Category"
            clearValue={() => undefined}
            placeholder="Category"
            onChange={handleTagSelect}
          />
          <Select
            options={statusOptions}
            // value={router.query.status}
            isMulti={false}
            className={`basic-single postFilter md:block hidden m-0 outline-none focus:outline-none text-sm bg-gray-200 border rounded px-0 cursor-pointer mr-4 ${styles.min_w_10}`}
            classNamePrefix="Blog Status"
            clearValue={() => undefined}
            placeholder="Blog Status"
            onChange={handleStatusSelect}
          />

          {/* Add a New Post creates a new post and goes to /posts/write/:postId  */}
          <div
            onClick={handleAddNewPost}
            className={`bg-black h-8 hover:bg-white border border-black text-white hover:text-black hidden md:flex items-center text-sm font-semibold px-4 py-2 md:mr-3 rounded-sm cursor-pointer duration-700 ${styles.h_40px}`}
          >
            <p>Add a New Post</p>
          </div>
        </div>
      </div>
    </div>
  );
}
