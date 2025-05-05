import axios from "axios";
import { useState } from "react";

type ApiPostType = {
  article_id: number;
  title: string;
  content: string;
  author_id: number;
  creation_date: string;
  author?: {
    author_name: string;
  };
}

export const apiRequest = (url: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [posts, setPosts] = useState<ApiPostType[]>([]); // Typage des posts

  async function request() {
    await axios
      .get(`http://localhost:8000/${url}`)
      .then(res => {
        const data = res.data;
        setPosts(data);
        console.log(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }

  request();
  return posts;
};

 