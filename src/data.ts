const initialCategories = [
  { id: "technology", name: "Technology" },
  { id: "political", name: "Political" },
  { id: "business", name: "Business" },
  { id: "war", name: "War" },
];

const initialNews = [
  {
    id: "1",
    title: "Technology News",
    categoryId: "technology",
    content: "This is a technology news article.",
    imageUrl:
      "https://images.unsplash.com/photo-1485827404703-87b59e892ddf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    author: "John Doe",
    createdAt: "2023-10-26T10:00:00.000Z",
    isFeatured: true,
    isBreakingNews: true,
    summary: "This is a summary of the technology news article.",
  },
  {
    id: "2",
    title: "Political News",
    categoryId: "political",
    content: "This is a political news article.",
    imageUrl:
      "https://images.unsplash.com/photo-1518369886074-625f86fe83d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    author: "Jane Smith",
    createdAt: "2023-10-25T10:00:00.000Z",
    isFeatured: false,
    isBreakingNews: false,
    summary: "This is a summary of the political news article.",
  },
  {
    id: "3",
    title: "Business News",
    categoryId: "business",
    content: "This is a business news article.",
    imageUrl:
      "https://images.unsplash.com/photo-1504711434696-1ca7a8490e40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    author: "Peter Jones",
    createdAt: "2023-10-24T10:00:00.000Z",
    isFeatured: false,
    isBreakingNews: false,
    summary: "This is a summary of the business news article.",
  },
  {
    id: "4",
    title: "War News",
    categoryId: "war",
    content: "This is a war news article.",
    imageUrl:
      "https://images.unsplash.com/photo-1677539541504-8087a5912874?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    author: "Alice Brown",
    createdAt: "2023-10-23T10:00:00.000Z",
    isFeatured: false,
    isBreakingNews: false,
    summary: "This is a summary of the war news article.",
  },
  {
    id: "5",
    title: "Breaking: Local Cat Saves Owner from Burning Building",
    categoryId: "technology",
    content:
      "In a heartwarming turn of events, a local cat named Mittens has been hailed a hero after saving its owner from a burning building. The fire, believed to have been started by a faulty toaster, quickly engulfed the kitchen of the Smith residence on Elm Street early this morning. Mittens, sensing the danger, repeatedly jumped on Mr. Smith's face, waking him up just in time to escape the blaze. Firefighters arrived shortly after and were able to contain the fire before it spread to neighboring homes. Mr. Smith was treated for smoke inhalation but is otherwise unharmed, thanks to the quick thinking and bravery of his feline companion. Mittens has been awarded the Key to the City and is enjoying a well-deserved nap.",
    imageUrl:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=778&q=80",
    author: "David Lee",
    createdAt: "2023-10-22T10:00:00.000Z",
    isFeatured: false,
    isBreakingNews: true,
    summary: "A local cat saves its owner from a burning building.",
  },
  {
    id: "6",
    title: "Scientists Discover New Planet Habitable for Humans",
    categoryId: "technology",
    content:
      "In a groundbreaking discovery, scientists have announced the discovery of a new planet that is potentially habitable for humans. The planet, named Kepler-186f, is located in the habitable zone of its star, meaning that it could have liquid water on its surface. This discovery could have major implications for the future of humanity, as it could provide a new home for humans if Earth becomes uninhabitable.",
    imageUrl:
      "https://images.unsplash.com/photo-1507232179824-3ba641c20da9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    summary:
      "Scientists discover a new planet that is potentially habitable for humans.",
    author: "Dr. Jane Smith",
    createdAt: "2023-10-27T10:00:00.000Z",
    viewCount: 1500,
    isBreakingNews: true,
  },
];

export const initializeLocalStorage = () => {
  console.log("initializeLocalStorage called");
  if (!localStorage.getItem("categories")) {
    localStorage.setItem("categories", JSON.stringify(initialCategories));
  }
  if (!localStorage.getItem("news")) {
    localStorage.setItem("news", JSON.stringify(initialNews));
  }
};

export const getCategories = () => {
  const categories = localStorage.getItem("categories");
  return categories ? JSON.parse(categories) : [];
};

export const getNews = () => {
  const news = localStorage.getItem("news");
  return news ? JSON.parse(news) : [];
};

export const getAllArticles = () => {
  return getNews();
};

export const addArticle = (article) => {
  const news = JSON.parse(localStorage.getItem("news") || "[]");
  article.id = Math.random().toString(36).substring(2, 15);
  news.push(article);
  localStorage.setItem("news", JSON.stringify(news));
  return Promise.resolve();
};

export const updateArticle = (id, article) => {
  const news = JSON.parse(localStorage.getItem("news") || "[]");
  const index = news.findIndex((a) => a.id === id);
  if (index !== -1) {
    news[index] = { ...news[index], ...article };
    localStorage.setItem("news", JSON.stringify(news));
  }
  return Promise.resolve();
};
