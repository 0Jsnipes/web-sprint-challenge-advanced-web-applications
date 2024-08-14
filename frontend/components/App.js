import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';

const articlesUrl = 'http://localhost:9000/api/articles';
const loginUrl = 'http://localhost:9000/api/login';

export default function App() {
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  const currentArticle = articles.find(article => article.article_id === currentArticleId) || null;
  console.log('Current Article ID:', currentArticleId);
  console.log('Current Article:', currentArticle);

  const navigate = useNavigate();

  const redirectToLogin = () => navigate('/');
  const redirectToArticles = () => navigate('/articles');

  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);

    fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        localStorage.setItem('token', data.token);
        setMessage(data.message);
        setSpinnerOn(false);
        redirectToArticles();
      })
      .catch(error => {
        setMessage('Login failed.');
        setSpinnerOn(false);
      });
  };

  const getArticles = () => {
    setMessage('');
    setSpinnerOn(true);

    const token = localStorage.getItem('token');

    fetch(articlesUrl, {
      headers: {
        Authorization: token,
      },
    })
      .then(response => response.json())
      .then(data => {
        setArticles(data.articles);
        setMessage(data.message);
        setSpinnerOn(false);
      })
      .catch(error => {
        if (error.status === 401) {
          redirectToLogin();
        } else {
          setMessage('Failed to fetch articles.');
        }
        setSpinnerOn(false);
      });
  };

  const postArticle = article => {
    setMessage('');
    setSpinnerOn(true);

    const token = localStorage.getItem('token');

    fetch(articlesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(article),
    })
      .then(response => response.json())
      .then(data => {
        setArticles([...articles, data.article]);
        setMessage(data.message);
        setSpinnerOn(false);
      })
      .catch(error => {
        setMessage('Failed to post article.');
        setSpinnerOn(false);
      });
  };

  const updateArticle = (article) => {
    setMessage('');
    setSpinnerOn(true);
  
    const token = localStorage.getItem('token');
  
    fetch(`${articlesUrl}/${currentArticleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(article),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Update successful, response:', data);
        
        // Update the state with the edited article
        setArticles(prevArticles => 
          prevArticles.map(a => 
            a.article_id === currentArticleId ? data.article : a
          )
        );
        
        setMessage(data.message);
        setSpinnerOn(false);
        setCurrentArticleId(null); // Clear after update
      })
      .catch(error => {
        setMessage('Failed to update article.');
        setSpinnerOn(false);
      });
  };
  
  

  const deleteArticle = currentArticleId => {
    setMessage('');
    setSpinnerOn(true);
  
    const token = localStorage.getItem('token');
  
    fetch(`${articlesUrl}/${currentArticleId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete article');
        }
        return response.json();
      })
      .then(data => {
        // Update the state immediately
        setArticles(prevArticles => prevArticles.filter(a => a.id = !currentArticleId));
        setMessage(data.message);
        setSpinnerOn(false);
      })
      .catch(error => {
        setMessage('Failed to delete article.');
        setSpinnerOn(false);
        console.error('Delete error:', error);
      });
  };
  
  
  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? '0.25' : '1' }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
              postArticle={postArticle} 
              setCurrentArticleId={setCurrentArticleId} 
              updateArticle={updateArticle}
              currentArticle={currentArticle}
               />
              <Articles 
              articles={articles} 
              getArticles={getArticles} 
              deleteArticle={deleteArticle} 
              setCurrentArticleId={setCurrentArticleId}
              
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  );
}
