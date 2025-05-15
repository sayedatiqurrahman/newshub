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
  },
  {
    id: "2",
    title: "Political News",
    categoryId: "political",
    content: "This is a political news article.",
  },
  {
    id: "3",
    title: "Business News",
    categoryId: "business",
    content: "This is a business news article.",
  },
  {
    id: "4",
    title: "War News",
    categoryId: "war",
    content: "This is a war news article.",
  },
  {
    id: "5",
    title: "Breaking: Local Cat Saves Owner from Burning Building",
    categoryId: "technology",
    content:
      "In a heartwarming turn of events, a local cat named Mittens has been hailed a hero after saving its owner from a burning building. The fire, believed to have been started by a faulty toaster, quickly engulfed the kitchen of the Smith residence on Elm Street early this morning. Mittens, sensing the danger, repeatedly jumped on Mr. Smith's face, waking him up just in time to escape the blaze. Firefighters arrived shortly after and were able to contain the fire before it spread to neighboring homes. Mr. Smith was treated for smoke inhalation but is otherwise unharmed, thanks to the quick thinking and bravery of his feline companion. Mittens has been awarded the Key to the City and is enjoying a well-deserved nap.",
  },
  {
    id: "6",
    title: "Scientists Discover New Planet Habitable for Humans",
    categoryId: "technology",
    content:
      "In a groundbreaking discovery, scientists have announced the discovery of a new planet that is potentially habitable for humans. The planet, named Kepler-186f, is located in the habitable zone of its star, meaning that it could have liquid water on its surface. This discovery could have major implications for the future of humanity, as it could provide a new home for humans if Earth becomes uninhabitable.",
  },
];

export const initializeLocalStorage = () => {
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
