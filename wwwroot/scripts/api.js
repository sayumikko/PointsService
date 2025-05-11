const API_BASE = 'https://localhost:7273/api/points';

export function createPoint(point) {
  return $.ajax({
    url: API_BASE,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(point),
  });
}

export function updatePoint(id, data) {
  return $.ajax({
    url: `${API_BASE}/${id}`,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(data),
  });
}

export function deletePoint(id) {
  return $.ajax({
    url: `${API_BASE}/${id}`,
    type: 'DELETE'
  });
}

export function getPoints() {
  return $.get(API_BASE);
}

export function addComment(pointId, comment) {
  return $.ajax({
    url: `${API_BASE}/${pointId}/comments`,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(comment),
  });
}

export function updateComment(commentId, data) {
  return $.ajax({
    url: `${API_BASE}/comments/${commentId}`,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(data),
  });
}
