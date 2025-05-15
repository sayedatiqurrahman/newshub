// src/data.js
import { v4 as uuidv4 } from "uuid";

// Function to generate fake categories
const generateFakeCategories = (count) => {
    const categories = [];
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
    count,
    categories
) => {
    const articles = [];
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
const generateFakeUsers = (count) => {
    const users = [];
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
const getCategories = () => {
    const categoriesString = localStorage.getItem(CATEGORIES_KEY);
    return categoriesString ? JSON.parse(categoriesString) : [];
};

const addCategory = (category) => {
    const categories = getCategories();
    const newCategory = { id: uuidv4(), ...category };
    categories.push(newCategory);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return newCategory;
};

const updateCategory = (id, updatedCategory) => {
    const categories = getCategories();
    const updatedCategories = categories.map((category) =>
        category.id === id ? { ...category, ...updatedCategory } : category
    );
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
};

const deleteCategory = (id) => {
    const categories = getCategories();
    const updatedCategories = categories.filter((category) => category.id !== id);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
};

// Articles CRUD operations
const getArticles = () => {
    const articlesString = localStorage.getItem(ARTICLES_KEY);
    return articlesString ? JSON.parse(articlesString) : [];
};

const addArticle = (
    article
) => {
    const articles = getArticles();
    const newArticle = {
        id: uuidv4(),
        createdAt: new Date(),
        ...article,
    };
    articles.push(newArticle);
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
    return newArticle;
};

const updateArticle = (id, updatedArticle) => {
    const articles = getArticles();
    const updatedArticles = articles.map((article) =>
        article.id === id ? { ...article, ...updatedArticle } : article
    );
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(updatedArticles));
};

const deleteArticle = (id) => {
    const articles = getArticles();
    const updatedArticles = articles.filter((article) => article.id !== id);
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(updatedArticles));
};

// Users CRUD operations
const getUsers = () => {
    const usersString = localStorage.getItem(USERS_KEY);
    return usersString ? JSON.parse(usersString) : [];
};

const addUser = (user) => {
    const users = getUsers();
    const newUser = { id: uuidv4(), ...user };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
};

const updateUser = (id, updatedUser) => {
    const users = getUsers();
    const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, ...updatedUser } : user
    );
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
};

const deleteUser = (id) => {
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
};
