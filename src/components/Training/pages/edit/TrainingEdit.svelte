<script lang="ts">
  import TrainingCourseStorage from '../../../../lib/trainingCourse'
  import CourseEditor from '../../editor/CourseEditor.svelte'
  import { getContext, setContext } from 'svelte'
  import { type Writable } from 'svelte/store'
  import I18N from '../../../../lib/i18n'

  // eslint-disable-next-line
  const title = getContext('title') as Writable<string>

  /* eslint-disable*/
  let i18n = I18N.getInstance()
  setContext<Promise<I18N>>('i18n', i18n)
  i18n.then(i18n => $title = `${i18n.t('Training')} ${i18n.t('Course')} ${i18n.t('Edit')}`)

  export let params: { hash: string }
</script>

{#await TrainingCourseStorage.getInstance() then storage}
  <CourseEditor course={storage.get(Number(params.hash))} mode="edit" />
{/await}
