<script lang="ts">
    import { push } from 'svelte-spa-router'
    import type { TrainingCourse } from '../../../types'
    import TrainingCourseEditor from '../TrainingCourseEditor.svelte'

    let course: TrainingCourse

    async function save (): Promise<void> {
      if (course.songs.length === 0) await push('/training')
      const storage = chrome?.storage?.local
      if (storage === undefined) {
        alert('no Storage')
        await push('/training')
      }

      let data = (await storage.get()).trainings.courses as TrainingCourse[]

      if (data === undefined || data === null) {
        data = []
      }

      data.push(course)

      await storage.set({ trainings: { courses: data } })

      await push('/training')
    }
</script>

<div class="save" role="presentation" on:click={save}>
    저장
</div>
<TrainingCourseEditor bind:course={course}/>
