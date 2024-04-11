<script>
    import I18N from '../../../../lib/i18n'
  import CourseEditor from '../../editor/CourseEditor.svelte'
  import { getContext, setContext } from 'svelte'

  const title = getContext('title')

  /* eslint-disable*/
  let i18n = I18N.getInstance()
  setContext('i18n', i18n)
  i18n.then(i18n => $title = `${i18n.t('Training')} ${i18n.t('Course')} ${i18n.t('Edit')}`)
</script>

<CourseEditor />
