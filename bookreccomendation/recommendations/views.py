from django.shortcuts import render
import numpy as np
import pickle

# Load the necessary files
model = pickle.load(open('data/model.pkl', 'rb'))
book_names = pickle.load(open('data/books_name.pkl', 'rb'))
final_rating = pickle.load(open('data/final_ratings.pkl', 'rb'))
book_pivot = pickle.load(open('data/book_pivot.pkl', 'rb'))

def fetch_book_details(suggestions):
    book_details = []
    for book_id in suggestions[0]:
        try:
            book_title = book_pivot.index[book_id]
            book_info = final_rating[final_rating['title'] == book_title].iloc[0]
            book_details.append({
                'title': book_info['title'],
                'author': book_info['author'],
                'image_url': book_info['img_url'],
                'year': book_info['year'],
                'rating': book_info['rating'],
            })
        except Exception as e:
            print(f"Error fetching book details: {e}")  # Debugging output
    return book_details

def recommendation(request):
    context = {'book_names': book_names}
    if request.method == 'POST':
        selected_book = request.POST.get('selected_book')
        
        if selected_book:
            try:
                book_id = np.where(book_pivot.index == selected_book)[0][0]
                distances, suggestions = model.kneighbors(book_pivot.iloc[book_id, :].values.reshape(1, -1), n_neighbors=6)

                # Fetch the details of the recommended books
                recommended_books_details = fetch_book_details(suggestions)
                context['recommended_books'] = recommended_books_details

                print(f"Recommended Books: {recommended_books_details}")  # Debugging output
            except Exception as e:
                print(f"Error during recommendation: {e}")  # Debugging output

    return render(request, 'recommendation.html', context)