"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/apis/api";
import { toast } from "react-hot-toast";
import { Post } from "@/lib/types";
import Spinner from "./Spinner";
import Image from "next/image";

const NewPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Failed to fetch posts");
    }
  }, [isError, error]);

  useEffect(() => {
    if (data && data.length > 0) {
      const sortedPosts = data.sort(
        (a: Post, b: Post) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sortedPosts);
    }
  }, [data]);

  const settings = {
    infinite: true,
    centerPadding: "0",
    slidesToShow: 3,

    speed: 1000,
    focusOnSelect: true,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (current: number, next: number) => {
      setCurrentSlide(next);
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: "0",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerPadding: "0",
        },
      },
    ],
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      {posts.length === 0 && <p>No posts found.</p>}

      <div className="carousel-container">
        <Slider {...settings}>
          {posts.map((post, index) => (
            <div
              key={post.id}
              className={`relative px-2 transition-all duration-300 ease-in-out focus:scale-110 hover:scale-110  ${
                index === currentSlide ? "scale-110 z-10" : ""
              }`}
            >
              <Link
                href={`/posts/${post.id}`}
                className="bg-neutral-800 rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <div className="relative w-full h-[300px]">
                  {" "}
                  <Image
                    src={post.coverImage}
                    fill
                    alt={post.title}
                    className="w-[90%] h-100 object-cover transition-all duration-300 ease-in-out transform "
                  />
                </div>

                <div className="p-5 flex flex-col">
                  <p className="text-sm text-red-500">. {post.category}</p>
                  <h2 className="text-xl font-semibold text-zinc-900">
                    {post.title}
                  </h2>
                  <p className="text-sm text-neutral-400 mt-1">
                    By {post.author.username} •{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default NewPosts;
