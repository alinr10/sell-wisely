import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function FetchReviews() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [result, setResult] = useState('');
    const userToken = localStorage.getItem('userToken')

    const user = jwtDecode(userToken)
    const creatorID = user.userId
    const fetchReviews = async () => {
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/analyze/fetch-reviews', { url, creatorID });
            setReviews(response.data.reviews);
            setResult(response.data.result);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wrapper">
            <div className="content">
                <div className="container profile">
                    <div className="profile__right" style={{ display: "inline-block", fontSize: "20px", lineHeight: "40px" }}>
                        <div style={{ maxWidth: 600 }}>
                            <label>URL</label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Enter URL..."
                            />
                        </div>

                        <button onClick={fetchReviews} disabled={loading}>
                            {loading ? 'Fetching Reviews...' : 'Fetch Reviews'}
                        </button>

                        <div style={{ maxWidth: 600, marginTop: '20px' }}>
                            <h3>Reviews:</h3>
                            <ul>
                                {reviews.map((review, index) => (
                                    <li key={index}>{review}</li>
                                ))}
                            </ul>
                        </div>

                        {result && (
                            <div style={{ maxWidth: 600, marginTop: '20px' }}>
                                <h3>Result:</h3>
                                <p>{result}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
