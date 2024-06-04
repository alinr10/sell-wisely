import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function FetchReviews() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [result, setResult] = useState('');
    const [analyses, setAnalyses] = useState([]);
    const userToken = localStorage.getItem('userToken')

    const user = jwtDecode(userToken)
    const creatorID = user.userId
    useEffect(() => {
        fetchPreviousAnalyses();
    }, []);

    const fetchPreviousAnalyses = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/analyze/previous-analyses`, {
                params: { creatorID },
                withCredentials: true
            });
            setAnalyses(response.data.analyses);
        } catch (error) {
            console.error('Error fetching previous analyses:', error);
        }
    };


    return (
        <div className="wrapper">
            <div className="content">
                <div className="container profile">
                    <div className="profile__right" style={{ display: "inline-block", fontSize: "20px", lineHeight: "40px" }}>

                        <div style={{ maxWidth: 600, marginTop: '20px' }}>
                            <h3>Previous Analyses</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Analysis Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyses.map((analysis, index) => (
                                        <tr key={index}>
                                            <td>{analysis.productName}</td>
                                            <td>{analysis.result}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
