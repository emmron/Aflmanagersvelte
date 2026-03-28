<script lang="ts">
  import { page } from '$app/state';
</script>

<main class="flex flex-col items-center justify-center w-full h-full gap-4 text-center">
  <h1 class="text-6xl font-bold text-base-400">{page.status}</h1>
  <p class="text-lg text-base-300">{page.error?.message || 'Something went wrong'}</p>
  <a href="/" class="btn-primary mt-4">Back to Home</a>
</main>
