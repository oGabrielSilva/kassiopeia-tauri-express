<template>
  <div v-if="post.selectedPost === null">
    <p>{{ strings.noPostSelected }}</p>
  </div>
  <div v-else>
    <form>
      <div class="mb-3">
        <UIPostMediaImage
          clickable
          :src="post.selectedPost.mediaImage"
          @on:click="imageInputRef?.click()"
        />
        <div>
          <input
            ref="imageInputRef"
            type="file"
            class="is-hidden"
            accept="image/jpeg, image/png, image/webp"
            @input="onInputFile"
          />
        </div>
      </div>

      <UIFieldInput
        has-icon-left
        input-id="inp-title"
        :label="strings.title"
        :initial-value="payload.title"
        type="text"
        @on:input="(inp) => (payload.title = inp)"
      >
        <template #icon>
          <span class="icon is-small is-left">
            <font-awesome-icon :icon="['far', 'newspaper']" />
          </span>
        </template>
      </UIFieldInput>

      <UIFieldTextArea
        has-icon-left
        input-id="inp-description"
        :rows="6"
        :label="strings.description"
        :initial-value="payload.description"
        @on:input="(desc) => (payload.description = desc)"
      >
        <template #icon>
          <span class="icon is-small is-left">
            <font-awesome-icon :icon="['fas', 'flask']" />
          </span>
        </template>
      </UIFieldTextArea>

      <div>
        <UIFieldTextArea
          :helper="{
            isVisible: !isMetaDescValid,
            text: strings.metaDescriptionHelper,
          }"
          has-icon-left
          input-id="inp-meta-description"
          :rows="3"
          :label="strings.metaDescriptionLabel"
          :initial-value="payload.metaDescription"
          @on:input="
            (desc) => {
              payload.metaDescription = desc
              isMetaDescValid = isMetaDescriptionValid(desc)
            }
          "
        >
          <template #icon>
            <span class="icon is-small is-left">
              <font-awesome-icon :icon="['fas', 'info']" />
            </span>
          </template>
        </UIFieldTextArea>
        <small class="help">{{ payload.metaDescription.length }}</small>
        <p class="help">
          {{ strings.metaDescriptionInfo }}
        </p>
      </div>

      <div
        class="is-flex is-align-items-center g-1 is-justify-content-space-between py-3"
      >
        <div>
          <p
            class="label is-clickable"
            @click="
              (e) =>
                (e.currentTarget as HTMLElement).parentElement
                  ?.querySelector<HTMLElement>('.dropdown')
                  ?.querySelector('button')
                  ?.click()
            "
          >
            {{ strings.selectFontLabel }}
          </p>
          <UIDropdown
            is-a-font-selector
            :options="app.fontOptions"
            :grid="2"
            :initial-value="
              app.fontOptions.find((font) => font.face === payload.font.face)
            "
            @changed="(font) => (payload.font = font as any)"
          />
        </div>

        <div>
          <p
            class="label is-clickable"
            @click="
              (e) =>
                (e.currentTarget as HTMLElement).parentElement
                  ?.querySelector<HTMLElement>('.dropdown')
                  ?.querySelector('button')
                  ?.click()
            "
          >
            {{ strings.selectLangLabel }}
          </p>
          <UIDropdown
            :options="app.langOptions"
            @changed="(lang) => (payload.lang = lang as any)"
          />
        </div>
      </div>

      <div class="py-3">
        <label class="label"> {{ strings.editors }}</label>

        <UIDropdownEditors
          :exclude="payload.editors"
          @selected="
            (editor) => (payload.editors = [...payload.editors, editor])
          "
        />
        <div v-if="payload.editors.length > 0" class="pt-3 table-container">
          <table class="table is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th><abbr :title="strings.position">#</abbr></th>
                <th>
                  <abbr :title="strings.avatar">
                    <font-awesome-icon :icon="['fas', 'user-astronaut']" />
                  </abbr>
                </th>
                <th>{{ strings.name }}</th>
                <th>{{ strings.email }}</th>
                <th>{{ strings.actions }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(editor, index) in payload.editors"
                :key="index"
                :data-editor="editor.email"
              >
                <th>{{ index + 1 }}</th>
                <td>
                  <UIAvatar :height="32" :width="32" :user="editor" />
                </td>
                <td>{{ editor.name }}</td>
                <td>{{ editor.email }}</td>
                <td>
                  <button
                    :title="strings.removeEditor"
                    type="button"
                    class="button is-small is-danger is-outlined"
                    @click="removePayloadEditor(editor)"
                  >
                    <font-awesome-icon :icon="['fas', 'user-slash']" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="py-3 mb-3">
        <label class="label"> {{ strings.stacks }}</label>

        <UIDropdownStacks
          :exclude="payload.stacks"
          @selected="(stack) => (payload.stacks = [...payload.stacks, stack])"
        />
        <div v-if="payload.stacks.length > 0" class="pt-3 table-container">
          <table class="table is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th><abbr :title="strings.position">#</abbr></th>
                <th>{{ strings.name }}</th>
                <th>{{ strings.description }}</th>
                <th>
                  <abbr :title="strings.metaDescriptionLabel">
                    {{ strings.metaAbbr }}
                  </abbr>
                </th>
                <th>{{ strings.actions }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(stack, index) in payload.stacks"
                :key="index"
                :data-stack="stack.name"
              >
                <th>{{ index + 1 }}</th>
                <td>{{ stack.name }}</td>
                <td>{{ minimizeDescriptionField(stack.description) }}</td>
                <td>{{ minimizeDescriptionField(stack.metaDescription) }}</td>
                <td>
                  <button
                    :title="strings.remove"
                    type="button"
                    class="button is-small is-danger is-outlined"
                    @click="removePayloadStack(stack)"
                  >
                    <font-awesome-icon :icon="['fas', 'xmark']" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <label class="label" for="kw">
        {{ strings.keywords }}
      </label>

      <div class="field has-addons">
        <div class="control" data-input-addons>
          <input
            id="kw"
            ref="keywordsInputRef"
            class="input"
            type="text"
            :placeholder="strings.keywordsPlaceholder"
            @keydown="
              (e) => {
                if (e.key.toLocaleLowerCase() === 'enter') {
                  e.preventDefault()
                  addKeyword()
                }
              }
            "
          />
        </div>
        <div class="control">
          <button type="button" class="button is-info" @click="addKeyword">
            {{ strings.add }}
          </button>
        </div>
      </div>

      <div v-if="payload.keywords.length > 0" data-tag-keywords>
        <div
          v-for="(keyword, index) in payload.keywords"
          :key="index"
          class="tags has-addons m-0 p-0"
          :data-keyword="keyword"
        >
          <span class="tag">{{ keyword }}</span>
          <a
            role="button"
            class="tag is-delete"
            @click="removeKeywordRef = keyword"
          />
        </div>
        <UIModal
          v-if="removeKeywordRef !== null"
          :title="strings.removeKeyword.replace('#', removeKeywordRef)"
          :success-button="{
            text: strings['yes-remove'],
            click: () => removeKeyword(removeKeywordRef ?? ''),
          }"
          :cancel-button="{ text: strings['no-cancel'] }"
        />
      </div>
      <div v-else>
        <span>
          {{ strings.zeroKeywords }}
        </span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { User } from '@app/auth/models/User'
import UIDropdownEditors from '@app/components/home/views/post/UIDropdownEditors.vue'
import UIDropdownStacks from '@app/components/home/views/post/UIDropdownStacks.vue'
import UIPostMediaImage from '@app/components/post/UIPostMediaImage.vue'
import UIDropdown from '@app/components/shared/UIDropdown.vue'
import UIFieldInput from '@app/components/shared/UIFieldInput.vue'
import UIFieldTextArea from '@app/components/shared/UIFieldTextArea.vue'
import UIModal from '@app/components/shared/UIModal.vue'
import UIAvatar from '@app/components/user/UIAvatar.vue'
import { Stack } from '@app/models/Stack'
import { useI18n } from '@app/stores/useI18n'
import { usePost } from '@app/stores/usePost'
import { forbidden } from '@app/utilities/forbidden'
import { FormDataAPI } from '@app/utilities/FormDataAPI'
import { isForbidden } from '@app/utilities/isForbidden'
import { isMetaDescriptionValid } from '@app/utilities/isMetaDescriptionValid'
import { minimizeDescriptionField } from '@app/utilities/minimizeDescriptionField'
import { requireKassiopeiaToaster } from '@lib/kassiopeia-tools'
import app from '@resources/config/app.json'
import {
  ImageKassiopeiaProcessingTool,
  ScreenLockerKassiopeiaTool,
  type ToasterKassiopeiaTool,
} from 'kassiopeia-tools'
import { onMounted, reactive, ref } from 'vue'

let toaster: ToasterKassiopeiaTool
const locker = ScreenLockerKassiopeiaTool.get()

const post = usePost()
const strings = useI18n()

const payload = reactive({
  title: post.selectedPost?.title ?? '',
  description: post.selectedPost?.description ?? '',
  metaDescription: post.selectedPost?.metaDescription ?? '',
  keywords: post.selectedPost?.keywords ?? ([] as string[]),
  lang: post.selectedPost?.lang ?? app.langOptions[0],
  font: post.selectedPost?.font ?? app.fontOptions[0],
  editors: post.selectedPost?.editors ?? ([] as User[]),
  stacks: post.selectedPost?.stacks ?? ([] as Stack[]),
})

const imageInputRef = ref<HTMLInputElement>()
const keywordsInputRef = ref<HTMLInputElement>()
const isMetaDescValid = ref(isMetaDescriptionValid(payload.metaDescription))
const removeKeywordRef = ref<string | null>(null)

async function onInputFile() {
  const file =
    imageInputRef.value && imageInputRef.value.files
      ? imageInputRef.value.files[0]
      : null

  if (!file || !post.selectedPost) return
  locker.lock()

  try {
    const mediaImage =
      await ImageKassiopeiaProcessingTool.get().convertFileToWebpBlobWithoutClipping(
        file,
        0.75,
      )

    const result = await FormDataAPI.request.PATCH<{ url: string }>(
      `/post/${post.selectedPost.slug}/media`,
      { body: { mediaImage } },
    )

    if (isForbidden(result)) return forbidden()

    if (result.error) {
      toaster.danger(result.error.message)
    }

    if (result.body?.url) {
      const p = post.selectedPost
      p.mediaImage = result.body.url

      post.updatePostAndList(p, true)
    }
  } catch (error) {
    console.log(error)
    toaster.danger()
  } finally {
    locker.unlock()
  }
}

function removeKeyword(keyword: string) {
  payload.keywords = payload.keywords.filter((k) => k !== keyword)
  removeKeywordRef.value = null
}

function addKeyword() {
  if (!keywordsInputRef.value || !keywordsInputRef.value.value) {
    toaster.animationTool
      .shakeX(keywordsInputRef.value!.parentElement!.parentElement!, false, 500)
      .addEventOnCompletion(() => keywordsInputRef.value?.focus())
    return
  }
  const keyword = keywordsInputRef.value.value

  if (payload.keywords.includes(keyword)) {
    toaster.animationTool.shakeX(
      document.querySelector(`[data-keyword="${keyword}"]`)!,
    )
    toaster.info(strings.keywordAlreadyExists)
    return
  }

  payload.keywords = [...payload.keywords, keyword]
  keywordsInputRef.value.value = ''
  keywordsInputRef.value.focus({ preventScroll: false })
}

function removePayloadEditor(editor: User) {
  const row = document.querySelector<HTMLElement>(
    `tr[data-editor="${editor.email}"]`,
  )

  if (row) {
    const newPayload = payload.editors.filter(
      (edt) => edt.email !== editor.email,
    )
    toaster.animationTool.zoomOutEnd(row).addEventOnCompletion(() => {
      payload.editors = newPayload
    })
  }
}

function removePayloadStack(stack: Stack) {
  const row = document.querySelector<HTMLElement>(
    `tr[data-stack="${stack.name}"]`,
  )

  if (row) {
    const newPayload = payload.stacks.filter((st) => st.name !== stack.name)
    toaster.animationTool.zoomOutEnd(row).addEventOnCompletion(() => {
      payload.stacks = newPayload
    })
  }
}

onMounted(async () => {
  toaster = await requireKassiopeiaToaster()
})
</script>

<style scoped>
[data-input-addons] {
  width: 100%;
}

[data-tag-keywords] {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>
