export function getUserId() {
  let id = localStorage.getItem("zenvibe_user_id");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("zenvibe_user_id", id);
  }

  return id;
}
