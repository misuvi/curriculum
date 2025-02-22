import React, { useEffect, useState } from "react";
import Navbar from "../../component/myblogs/Navbar";
import MyBlogs from "../../component/myblogs/MyBlogs";
import Head from "next/head";
import SiteHeader from "../../component/layout/SiteHeader/SiteHeader";
import Cookies from "universal-cookie";
import PostService from "../../services/PostService";
import Pagination from "../../component/pagination/pagination";
import MyBlogsstyles from "../../styles/MyBlogs.module.css";
import { getCookieValue } from "../../lib/cookie";
import Image from "next/image";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  // console.log(context.req.headers.cookie);
  // console.log(context.query.pageNo);
  try {
    if (context.req.headers.cookie) {
      const contextCookie = getCookieValue(
        context.req.headers.cookie,
        "userNullcast"
      );
      if (contextCookie) {
        const cookie = JSON.parse(contextCookie);
        return {
          props: {
            // _pageNo: context.query.pageNo
          }
        };
      } else {
        return {
          redirect: {
            permanent: false,
            destination: "/login"
          }
        };
      }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/login"
        }
      };
    }
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    };
  }
}

export default function Posts() {
  const cookies = new Cookies();
  const userCookie = cookies.get("userNullcast");
  // console.log(userCookie);
  const router = useRouter();
  const [postData, setPostData] = useState({
    posts: [],
    count: 0,
    pageNo: router.query.pageNo,
    limit: 10
  });

  const [loaded, setLoaded] = useState(false);

  const [tagFilter, setTagFilter] = useState(router.query.tag);
  const [statusFilter, setStatusFilter] = useState(router.query.status);

  useEffect(() => {
    setTagFilter(router.query.tag);
    setStatusFilter(router.query.status);
    const newReqData = {
      pageNo: router.query.pageNo,
      limit: postData.limit,
      tag: router.query.tag,
      status: router.query.status
    };
    getPosts(newReqData);
  }, [router.query.pageNo, router.query.tag, router.query.status]);

  async function getPosts(reqData) {
    // console.log("getposts call");
    try {
      const data = await PostService.getPostsByUserId(userCookie, reqData);
      // console.log(data);
      const { posts, count } = data;
      // console.log({ posts });
      if (data) {
        setLoaded(true);
      }
      setPostData((prevValue) => {
        return {
          ...prevValue,
          posts: posts,
          count: count
        };
      });
    } catch (err) {
      console.log(err);
    }
  }

  const changePage = (newPageNo) => {
    // console.log("change page: ", newPageNo, tagFilter, statusFilter);
    router.push({
      pathname: "/posts",
      query: {
        pageNo: newPageNo,
        tag: router.query.tag,
        status: router.query.status
      }
    });
  };

  return (
    <div>
      <Head>
        <title>My Posts | Nullcast</title>
      </Head>
      <SiteHeader />
      <div className="bg-gray-100 px-3 md:px-6 min-h-screen-top">
        <div className="max-w-panel pt-15px">
          <Navbar />
          {loaded ? (
            postData.posts.length > 0 ? (
              <div>
                <MyBlogs posts={postData.posts} currentPage={postData.pageNo} />
              </div>
            ) : !tagFilter && !statusFilter ? (
              <div className="text-gray-700 text-center font-semibold mt-8">
                Looks like you haven't created any posts yet.
              </div>
            ) : (
              <div className="text-gray-700 text-center font-semibold mt-8">
                No results found.
              </div>
            )
          ) : (
            <div className="flex w-full justify-center h-96 items-center">
              <div className="h-20 w-20">
                <Image
                  src="/spinner-transparent.gif"
                  height="65px"
                  width="65px"
                />
              </div>
            </div>
          )}
          <div
            className={`fixed bottom-0 left-0 z-10 w-full flex justify-center items-center px-6 ${MyBlogsstyles.navigation}`}
          >
            <Pagination
              TotalCount={postData.count}
              changePage={changePage}
              pageNum={postData.pageNo}
              limit={postData.limit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
