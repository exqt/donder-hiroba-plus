<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  const dispatchEvent = createEventDispatcher()
  const agree = async (): Promise<void> => {
    dispatchEvent('agree')
  }
</script>

<span style="font-size: 36px;">
  ⚠️ 면책 조항
</span>

<p>
  이 확장 프로그램은 비공식 확장 프로그램입니다
</p>
<p>
  이 확장 프로그램은 <a href="https://donderhiroba.jp">donderhiroba.jp</a>의 <a href="https://donderhiroba.jp/other_agreement.php">서비스 약관</a>을 위반할 수 있습니다.
</p>
<p>
  이 확장 프로그램을 사용함에 있어 발생하는 모든 문제에 대해 개발자는 책임을 지지 않습니다.
</p>
<p>
  아래 버튼을 클릭하면 위의 내용에 동의하는 것으로 간주됩니다.
</p>
<button on:click={agree}>동의합니다</button>

<style>
  p {
    margin: 0;
    margin-bottom: 8px;
    word-break: keep-all;
  }
  a {
    color: rgb(159, 159, 255);
  }
</style>
