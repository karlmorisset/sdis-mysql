// eslint-disable-next-line no-undef
const socket = io();

const getUser = async () => {
  const res = await fetch('/auth/get-user');
  const user = await res.json();

  return user;
};

const getDataFromUrl = async (url, method, payload, errMsg) => {
  const res = await fetch(url, {
    method,
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(errMsg);
  }

  const data = await res.json();

  return data;
};

// Supprime un commentaire dans le DOM
const removeComment = (deletedComment) => {
  const deletedCommentNode = document.querySelector(
    `[data-id="${deletedComment.id}"]`,
  );
  deletedCommentNode.remove();
};

// Associe un écouteur d'évènement de suppression à un form
const bindDeleteListener = (formEl) => {
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const deletedComment = await getDataFromUrl(
        '/comments',
        'DELETE',
        {
          commentId: formEl.commentId.value,
        },
        'Erreur lors de la suppression du commentaire',
      );
      // removeComment(deletedComment);
      socket.emit('removeComment', { deletedComment });
    } catch (error) {
      console.warn(error);
    }
  });
};

const bindDeleteEventToFreshCommentNode = (newComment) => {
  const newCommentNode = document.querySelector(
    `[data-id="${newComment.id}"] [data-verb="delete"]`,
  );

  bindDeleteListener(newCommentNode);
};

const getCommentTemplate = async (newComment) => {
  const dataTemplate = `
    <div>
      <p>${newComment.author.email} - <span class="date">${newComment.createdAt}</span></p>
      <p>${newComment.body}</p>
    </div>
  `;

  const buttonsTemplate = `
    <div class='inline-buttons'>
      <form class='inline-form' data-verb="delete">
        <input type="hidden" name="commentId" value="${newComment.id}">
        <button type="submit" class="btn-icon btn-danger white"><i class="fa-solid fa-trash"></i></button>
      </form>
    </div>
  `;

  const user = await getUser();
  const isConnectedUser = newComment.author.id === user.id;

  let commentTemplate;
  if (isConnectedUser) {
    commentTemplate = `
      <div class="comment" data-id="${newComment.id}">
        ${dataTemplate}
        ${buttonsTemplate}
      </div>
    `;
  } else {
    commentTemplate = `
      <div class="comment" data-id="${newComment.id}">
        ${dataTemplate}
      </div>
    `;
  }

  return commentTemplate;
};

const addComment = async (newComment) => {
  const commentsContainer = document.querySelector('.comments');
  const comment = document.createElement('div');
  const nocomments = document.getElementById('nocomments');

  const commentTemplate = await getCommentTemplate(newComment);

  comment.innerHTML = commentTemplate;

  nocomments?.classList.add('not-empty');

  commentsContainer.appendChild(comment);

  bindDeleteEventToFreshCommentNode(newComment);
};

/**
 * Écouteurs d'évènements socket.io
 */
socket.on('newComment', (data) => addComment(data.newComment));
socket.on('removeComment', (data) => removeComment(data.deletedComment));

/**
 * Gestion du formulaire d'ajout d'un commentaire
 */
const addCommentForm = document.getElementById('add-comment');
if (addCommentForm) {
  addCommentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      // Soumission du formulaire
      const res = await fetch('/comments', {
        method: 'POST',
        body: JSON.stringify({
          comment: addCommentForm.comment.value,
          match: addCommentForm.match.value,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout du commentaire");

      const newComment = await res.json();

      //addComment(newComment);
      addCommentForm.reset();
      socket.emit('newComment', { newComment });
    } catch (error) {
      console.warn(error);
    }
  });
}

/**
 * Association de l'écouteur d'évènement sur tous les boutons delete
 */
document.querySelectorAll('[data-verb="delete"]').forEach(async (formEl) => {
  bindDeleteListener(formEl);
});
