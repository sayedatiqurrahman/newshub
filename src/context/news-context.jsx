import React, { createContext, useState, useEffect, useContext } from 'react';
import {
    getCategories,
    getNews,
    addArticle,
    updateArticle,
} from '../data.ts';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadData = () => {
            setArticles(getNews());
            setCategories(getCategories());
        };

        loadData();
    }, []);

    const createArticle = async (articleData) => {
        await addArticle(articleData);
        setArticles(getNews());
    };

    const updateArticleData = async (id, articleData) => {
        await updateArticle(id, articleData);
        setArticles(getNews());
    };

    const deleteArticleData = async (id) => {
        // TODO: Implement deleteArticle
        const news = JSON.parse(localStorage.getItem("news") || "[]");
        const updatedNews = news.filter((article) => article.id !== id);
        localStorage.setItem("news", JSON.stringify(updatedNews));
        setArticles(getNews());
    };

    const value = {
        articles,
        categories,
        createArticle,
        updateArticleData,
        deleteArticleData,
    };

    return (
        <NewsContext.Provider value={value}>
            {children}
        </NewsContext.Provider>
    );
};

export const useNews = () => {
    return useContext(NewsContext);
};
