<template>
  <div class="card">
    <div class="card-image">
      <figure class="image is-3by1">
        <img
          role="button"
          class="is-clickable"
          :src="props.post.mediaImage ?? postImagePlaceholder"
          :alt="strings.postImgAlt + '- ' + props.post.title"
          @click="to"
        />
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <h1
            class="title is-4 mb-0 pb-0 is-clickable"
            role="button"
            @click="to"
          >
            {{ props.post.title }}
          </h1>
          <p>{{ minimizeDescriptionField(props.post.description) }}</p>
        </div>
      </div>

      <div class="content">
        <address>
          {{ strings.by }}
          <a rel="author" class="button is-ghost p-0 m-0">{{
            props.post.author.name
          }}</a>
          <div>
            <span>{{ strings.updatedAt + ' ' }}</span>
            <em>
              <time :datetime="props.post.updatedAt.toISOString()">
                {{ formatTime(props.post.updatedAt) }}
              </time>
            </em>
          </div>
        </address>

        <div
          v-if="props.post.stacks.length > 0"
          class="is-flex is-align-items-center pb-3"
        >
          <strong>{{ strings.stacks }}:</strong>
          <a
            v-for="(stack, stackIndex) in props.post.stacks"
            :key="stackIndex"
            class="button is-ghost p-0 m-0 pl-1"
          >
            {{ stack.name }}
          </a>
        </div>

        <div
          v-if="props.post.keywords.length > 0"
          class="is-flex is-align-items-center g-1"
        >
          <span
            v-for="(keyword, keyIndex) in props.post.keywords"
            :key="keyIndex"
            class="tag"
          >
            {{ keyword }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Post } from '@app/models/Post'
import { useI18n } from '@app/stores/useI18n'
import { usePost } from '@app/stores/usePost'
import { formatTime } from '@app/utilities/formatTime'
import { minimizeDescriptionField } from '@app/utilities/minimizeDescriptionField'
import postImagePlaceholder from '@resources/png/1280x960.png'
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

interface IProps {
  post: Post
}

const pst = usePost()
const router = useRouter()

const props = defineProps<IProps>()

const strings = useI18n()

function to() {
  pst.nextPost(props.post)
  router.push('/post')
}
</script>

<style scoped>
img {
  object-fit: cover;
}
</style>
