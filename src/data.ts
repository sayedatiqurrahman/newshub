// src/data.ts
import { v4 as uuidv4 } from "uuid";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: string | null;
  color: string | null;
  isActive: boolean | null;
  createdAt: Date;
  updatedAt?: Date;
}

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: Date;
}

interface User {
  id: string;
  username: string;
  email: string;
}

// Function to generate fake categories
const generateFakeCategories = (count: number): Category[] => {
  const categories: Category[] = [];
  for (let i = 0; i < count; i++) {
    categories.push({
      id: uuidv4(),
      name: `Category ${i + 1}`,
      description: `Description for category ${i + 1}`,
      slug: `category-${i + 1}`,
      icon: null,
      color: null,
      isActive: true,
      createdAt: new Date(),
    });
  }
  return categories;
};

// Function to generate fake news articles
const generateFakeNewsArticles = (
  count: number,
  categories: Category[]
): NewsArticle[] => {
  const articles: NewsArticle[] = [];
  const authors = ["John Doe", "Jane Smith", "Alice Johnson"];
  for (let i = 0; i < count; i++) {
    articles.push({
      id: uuidv4(),
      title: `News Article ${i + 1}`,
      content: `This is the content of news article ${i + 1}.`,
      category: categories[i % categories.length].id,
      author: authors[i % authors.length],
      createdAt: new Date(),
    });
  }
  return articles;
};

// Function to generate fake users
const generateFakeUsers = (count: number): User[] => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: uuidv4(),
      username: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
    });
  }
  return users;
};

// Local Storage Keys
const CATEGORIES_KEY = "newsNexus_categories";
const ARTICLES_KEY = "newsNexus_articles";
const USERS_KEY = "newsNexus_users";

// Initialize Local Storage
const initializeLocalStorage = () => {
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    const fakeCategories = generateFakeCategories(5);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(fakeCategories));
  }
  if (!localStorage.getItem(ARTICLES_KEY)) {
    const categories = getCategories();
    const fakeArticles = generateFakeNewsArticles(20, categories);
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(fakeArticles));
  }
  if (!localStorage.getItem(USERS_KEY)) {
    const fakeUsers = generateFakeUsers(3);
    localStorage.setItem(USERS_KEY, JSON.stringify(fakeUsers));
  }
};

// Categories CRUD operations
const getCategories = (): Category[] => {
  const categoriesString = localStorage.getItem(CATEGORIES_KEY);
  return categoriesString ? JSON.parse(categoriesString) : [];
};

const addCategory = (category: Omit<Category, "id">): Category => {
  const categories = getCategories();
  const newCategory: Category = { id: uuidv4(), ...category };
  categories.push(newCategory);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  return newCategory;
};

const updateCategory = (id: string, updatedCategory: Category): void => {
  const categories = getCategories();
  const updatedCategories = categories.map((category) =>
    category.id === id ? { ...category, ...updatedCategory } : category
  );
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
};

const deleteCategory = (id: string): void => {
  const categories = getCategories();
  const updatedCategories = categories.filter((category) => category.id !== id);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
};

// Articles CRUD operations
const getArticles = (): NewsArticle[] => {
  const articlesString = localStorage.getItem(ARTICLES_KEY);
  return articlesString ? JSON.parse(articlesString) : [];
};

const addArticle = (
  article: Omit<NewsArticle, "id" | "createdAt">
): NewsArticle => {
  const articles = getArticles();
  const newArticle: NewsArticle = {
    id: uuidv4(),
    createdAt: new Date(),
    ...article,
  };
  articles.push(newArticle);
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  return newArticle;
};

const updateArticle = (id: string, updatedArticle: NewsArticle): void => {
  const articles = getArticles();
  const updatedArticles = articles.map((article) =>
    article.id === id ? { ...article, ...updatedArticle } : article
  );
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(updatedArticles));
};

const deleteArticle = (id: string): void => {
  const articles = getArticles();
  const updatedArticles = articles.filter((article) => article.id !== id);
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(updatedArticles));
};

// Users CRUD operations
const getUsers = (): User[] => {
  const usersString = localStorage.getItem(USERS_KEY);
  return usersString ? JSON.parse(usersString) : [];
};

const addUser = (user: Omit<User, "id">): User => {
  const users = getUsers();
  const newUser: User = { id: uuidv4(), ...user };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
};

const updateUser = (id: string, updatedUser: User): void => {
  const users = getUsers();
  const updatedUsers = users.map((user) =>
    user.id === id ? { ...user, ...updatedUser } : user
  );
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
};

const deleteUser = (id: string): void => {
  const users = getUsers();
  const updatedUsers = users.filter((user) => user.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
};

export {
  initializeLocalStorage,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  Category,
  NewsArticle,
  User,
};
