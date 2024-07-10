import { Post, type IPost } from '@app/models/Post'
import { forbidden } from '@app/utilities/forbidden'
import { isForbidden } from '@app/utilities/isForbidden'
import { JsonAPI } from '@app/utilities/JsonAPI'
import { requireKassiopeiaToaster } from '@lib/kassiopeia-tools'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export const usePost = defineStore('Post', () => {
  const recoveryUserPostsPending = ref(false)
  const selectedPostRef = ref<Post>()
  const userPostsReactive = reactive({
    posts: [] as Post[],
    hadFirstLoad: false,
  })

  const selectedPost = computed(() =>
    selectedPostRef.value ? selectedPostRef.value : null,
  )

  const userPosts = computed(() => userPostsReactive.posts)

  function nextPost(post: Post | IPost) {
    const p = Post.from(post)
    selectedPostRef.value = p
  }

  function updatePostAndList(modifiedPost: Post, selectPost = false) {
    if (selectPost) nextPost(modifiedPost)

    updateUserPosts([
      ...userPosts.value.filter((pst) => pst.slug !== modifiedPost.slug),
      Post.from(modifiedPost),
    ])
  }

  function updateUserPosts(posts?: Post[]) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(posts)) {
        userPostsReactive.posts = posts
        resolve(null)
        return
      }

      requireKassiopeiaToaster().then((toaster) => {
        JsonAPI.request
          .GET('user/posts')
          .then((result) => {
            if (isForbidden(result)) {
              forbidden()
              reject('FORBIDDEN')
              return
            }
            if (result.error) {
              toaster.danger(result.error.message)
              reject(result.error)
              return
            }

            if (Array.isArray(result.body)) {
              userPostsReactive.posts = Array.from(result.body).map((post) =>
                Post.from(post as Post),
              )
              resolve(null)
            }
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    })
  }

  function recoveryUserPostsIfFirstTime() {
    return new Promise((resolve) => {
      try {
        if (userPostsReactive.hadFirstLoad || recoveryUserPostsPending.value)
          return
        recoveryUserPostsPending.value = true

        updateUserPosts()
          .then(() => {
            recoveryUserPostsPending.value = false
            userPostsReactive.hadFirstLoad = true
          })
          .catch(() => {
            recoveryUserPostsPending.value = false
          })
      } catch (err) {
        console.log(err)
      } finally {
        resolve(null)
      }
    })
  }

  return {
    selectedPost,
    nextPost,
    userPosts,
    updateUserPosts,
    recoveryUserPostsIfFirstTime,
    updatePostAndList,
  }
})
