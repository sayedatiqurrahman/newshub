let categories = [];
let articles = [];
let users = [];

// Categories CRUD operations
const getCategories = () => {
    return categories;
};

const addCategory = (category) => {
    const newCategory = { id: Math.random().toString(36).substring(2, 15), ...category };
    categories.push(newCategory);
    return newCategory;
};

const updateCategory = (id, updatedCategory) => {
    categories = categories.map((category) =>
        category.id === id ? { ...category, ...updatedCategory } : category
    );
};

const deleteCategory = (id) => {
    categories = categories.filter((category) => category.id !== id);
};

// Articles CRUD operations
const getArticles = () => {
    const storedArticles = localStorage.getItem("news");
    return storedArticles ? JSON.parse(storedArticles) : [];
};

const addArticle = (article) => {
    const newArticle = { id: Math.random().toString(36).substring(2, 15), createdAt: new Date(), ...article };
    const storedArticles = localStorage.getItem("news");
    const articles = storedArticles ? JSON.parse(storedArticles) : [];
    articles.push(newArticle);
    localStorage.setItem("news", JSON.stringify(articles));
    return newArticle;
};

const updateArticle = (id, updatedArticle) => {
    const storedArticles = localStorage.getItem("news");
    let articles = storedArticles ? JSON.parse(storedArticles) : [];
    articles = articles.map((article) =>
        article.id === id ? { ...article, ...updatedArticle } : article
    );
    localStorage.setItem("news", JSON.stringify(articles));
};

const deleteArticle = (id) => {
    const storedArticles = localStorage.getItem("news");
    let articles = storedArticles ? JSON.parse(storedArticles) : [];
    articles = articles.filter((article) => article.id !== id);
    localStorage.setItem("news", JSON.stringify(articles));
};

// Users CRUD operations
const getUsers = () => {
    return users;
};

const addUser = (user) => {
    const newUser = { id: Math.random().toString(36).substring(2, 15), ...user };
    users.push(newUser);
    return newUser;
};

const updateUser = (id, updatedUser) => {
    users = users.map((user) =>
        user.id === id ? { ...user, ...updatedUser } : user
    );
};

const deleteUser = (id) => {
    users = users.filter((user) => user.id !== id);
};

export {
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
