function like(id) {
  var split_id = id.split("_"),
    type = split_id[0],
    postId = split_id[1];
  $.ajax({
    url: '/login/user/likeunlike',
    type: 'post',
    data: { postId, type },
    dataType: 'json',
    success: (data) => {
      if (type == 'like')
        document.getElementById("likes_" + postId).innerHTML = data.data;
      else
        document.getElementById("unlikes_" + postId).innerHTML = data.data;
    },
    error: (err) => {
      alert(err)
    }
  });
}

function comment(id) {
  var str = document.getElementById('c_id').value;
  var split_id = id.split("_"),
    name = split_id[0],
    id = split_id[1];
  $.ajax({
    url: '/login/user/comment',
    type: 'post',
    data: { id, str, name },
    dataType: 'json',
    success: () => {
      alert("succes");
      document.getElementById("c_name_" + id).innerHTML = name;
      document.getElementById("c_comment_" + id).innerHTML = str;
    },
    error: (err) => {
      alert(err)
    }
  })
}