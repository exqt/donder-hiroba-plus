<script>
    import CourseEditor from '../../editor/CourseEditor.svelte'
    import { getContext } from 'svelte'

    // eslint-disable-next-line
    (getContext('title')).set('훈련 코스 추가')
</script>

<CourseEditor/>
