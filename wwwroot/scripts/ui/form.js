function createForm(id, position, htmlContent) {
  $(`#${id}`).remove();
  const form = $(`
    <div id="${id}" style="left: ${position.x}px; top: ${position.y}px;">
      <div class="form-header"><button class="close-form">×</button></div>
      ${htmlContent}
    </div>
  `).appendTo('body');

  form.find('.close-form').click(() => form.remove());
  return form;
}


export function showEditForm(circle, onSubmit) {
  const pos = circle.getStage().getPointerPosition();

  const form = createForm('edit-form', pos, `
    <label>Цвет точки:
      <input type="color" id="point-color" value="${circle.fill()}">
    </label>
    <label>Радиус:
      <input type="number" id="point-radius" value="${circle.radius()}">
    </label>
    <button id="update-point">Обновить</button>
  `);

  form.find('#update-point').click(() => {
    const updated = {
      radius: parseFloat($('#point-radius').val()),
      color: $('#point-color').val()
    };
    onSubmit(updated);
    form.remove();
  });
}


export function showCommentForm(pos, onSubmit) {
  const offsetPos = { x: pos.x + 20, y: pos.y };

  const form = createForm('comment-form', offsetPos, `
    <label>Комментарий:
      <textarea id="comment-text" placeholder="Введите комментарий"></textarea>
    </label>
    <label>Цвет фона:
      <input type="color" id="comment-color" value="#ffffff">
    </label>
    <button id="submit-comment">Добавить</button>
  `);

  form.find('#submit-comment').click(() => {
    const comment = {
      text: $('#comment-text').val(),
      backgroundColor: $('#comment-color').val()
    };
    onSubmit(comment);
    form.remove();
  });
}


export function showEditCommentForm(comment, pos, onSubmit) {
  const form = createForm('edit-comment-form', pos, `
    <label>Комментарий:
      <textarea id="edit-comment-text">${comment.text}</textarea>
    </label>
    <label>Цвет фона:
      <input type="color" id="edit-comment-color" value="${comment.backgroundColor}">
    </label>
    <button id="update-comment">Сохранить</button>
  `);

  form.find('#update-comment').click(() => {
    const updated = {
      text: $('#edit-comment-text').val(),
      backgroundColor: $('#edit-comment-color').val()
    };
    onSubmit(updated);
    form.remove();
  });
}