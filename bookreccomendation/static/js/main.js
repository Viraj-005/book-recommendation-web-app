document.getElementById('recommendation-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const bookName = document.getElementById('book-name').value;
    const numRecommendations = document.getElementById('num-recommendations').value;
    
    fetch('/recommend/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: `book_name=${encodeURIComponent(bookName)}&num_recommendations=${numRecommendations}`
    })
    .then(response => response.json())
    .then(data => {
        const recommendationsDiv = document.getElementById('recommendations');
        recommendationsDiv.innerHTML = '';
        if (data.error) {
            recommendationsDiv.innerHTML = `<p>${data.error}</p>`;
        } else {
            data.recommendations.forEach(book => {
                const bookDiv = document.createElement('div');
                bookDiv.className = 'book';
                bookDiv.innerHTML = `
                    <img src="data:image/png;base64,${book.image}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p>Rating: ${book.rating}</p>
                `;
                recommendationsDiv.appendChild(bookDiv);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('recommendations').innerHTML = '<p>An error occurred while fetching recommendations.</p>';
    });
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}