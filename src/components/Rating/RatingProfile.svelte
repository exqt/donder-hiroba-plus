<script lang="ts">
    import type { CardData } from 'node-hiroba/types'

    export let cardData: CardData
</script>

<table>
    <tr>
        <td colspan="2">
            <img src={cardData.myDon} alt="mydon" style="max-width: 100%;"/>
        </td>
    </tr>
    <tr>
        <td>
            Nickname
        </td>
        <td>
            {cardData.nickname}
        </td>
    </tr>
    <tr>
        <td>
            Taiko number
        </td>
        <td>
            {cardData.taikoNumber}
        </td>
    </tr>
</table>

<style>
    table{
        max-width: 100%;border-collapse: collapse;
    }

    tr{
        text-align: center;
    }

    td{
        text-align: center;border: 1px solid black;
    }
</style>
