<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  const dispatchEvent = createEventDispatcher()
  const agree = async (): Promise<void> => {
    dispatchEvent('agree')
  }
</script>

<span style="font-size: 36px;">
  ⚠️ 免責事項
</span>

<p>
  この拡張機能は非公式のChrome拡張機能です。
</p>
<p>
  この拡張機能は
  <a href="https://donderhiroba.jp">donderhiroba.jp</a>の<a href="https://donderhiroba.jp/other_agreement.php">サービス利用規約</a>に違反する可能性があります。
</p>
<p>
  この拡張機能の使用により発生するすべての問題について、開発者は責任を負いません。
</p>
<p>
  下のボタンをクリックすると、上記の内容に同意したものとみなされます。
</p>
<button on:click={agree}>同意します</button>

<style>
  p {
    margin: 0;
    margin-bottom: 8px;
  }
  a {
    color: rgb(159, 159, 255);
  }
</style>
