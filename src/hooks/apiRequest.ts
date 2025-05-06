import axios from "axios";
import { Article } from "../types/api";

export const getPosts = (setLoading: React.Dispatch<React.SetStateAction<boolean>>, setArticles: React.Dispatch<React.SetStateAction<Article[]>>) => {

  async function request() {
    await axios
      .get(`http://localhost:8000/list`)
      .then(res => {
        const data = res.data;
        setArticles(data);
        console.log(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }

  request();
};

 