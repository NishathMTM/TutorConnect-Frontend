<script setup lang="ts">
interface Props {
   endpoint: string;
   maxSize?: number; // in MB
   accept?: string[];
   label?: string;
   fieldName?: string;
}

const props = withDefaults(defineProps<Props>(), {
   maxSize: 4, // 4MB default
   accept: () => ['image/jpeg', 'image/png', 'image/webp'],
   label: 'Drop your image here or click to upload',
   fieldName: 'file',
});

const emit = defineEmits<{
   success: [response: any];
   error: [message: string];
   uploading: [status: boolean];
}>();

const isDragging = ref(false);
const isUploading = ref(false);
const previewUrl = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Handle file selection
async function handleFileSelect(files: FileList | null) {
   if (!files || files.length === 0)
      return;

   const file = files[0];

   // Type guard to ensure file is a File object
   if (!(file instanceof File)) {
      emit('error', 'Invalid file object');
      return;
   }

   // Validate file type
   if (!props.accept.includes(file.type)) {
      emit('error', `Invalid file type. Please upload: ${props.accept.map(type => type.split('/')[1]).join(', ')}`);
      return;
   }

   // Validate file size
   if (file.size > props.maxSize * 1024 * 1024) {
      emit('error', `File size must be less than ${props.maxSize}MB`);
      return;
   }

   // Show preview
   previewUrl.value = URL.createObjectURL(file);

   // Upload file
   try {
      isUploading.value = true;
      emit('uploading', true);

      const formData = new FormData();
      formData.append(props.fieldName, file);

      const response = await useNuxtApp().$api(props.endpoint, {
         method: 'POST',
         body: formData,
         headers: {
            Accept: 'application/json',
         },
      });

      emit('success', response);
   }
   catch (error: any) {
      console.error('Upload failed:', error);
      emit('error', error?.message || 'Failed to upload image');
      previewUrl.value = null;

      // Reset file input
      if (fileInput.value)
         fileInput.value.value = '';
   }
   finally {
      isUploading.value = false;
      emit('uploading', false);
   }
}

// Handle drag events
function handleDragEnter(e: DragEvent) {
   e.preventDefault();
   isDragging.value = true;
}

function handleDragLeave(e: DragEvent) {
   e.preventDefault();
   isDragging.value = false;
}

function handleDrop(e: DragEvent) {
   e.preventDefault();
   isDragging.value = false;
   handleFileSelect(e.dataTransfer?.files || null);
}

// Cleanup preview URL when component is unmounted
onBeforeUnmount(() => {
   if (previewUrl.value)
      URL.revokeObjectURL(previewUrl.value);
});
</script>

<template>
   <div
      class="relative"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover.prevent
      @drop="handleDrop"
   >
      <!-- Upload Area -->
      <div
         class="border-2 border-dashed rounded-lg p-6 transition-colors"
         :class="[
            isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400',
            isUploading ? 'opacity-50 pointer-events-none' : '',
         ]"
      >
         <!-- Preview Image -->
         <div v-if="previewUrl" class="mb-4">
            <img
               :src="previewUrl"
               alt="Preview"
               class="max-h-48 mx-auto rounded-lg object-contain"
            >
         </div>

         <!-- Upload Input -->
         <div class="text-center">
            <input
               ref="fileInput"
               type="file"
               class="hidden"
               :accept="accept.join(',')"
               @change="(e: Event) => {
                  const target = e.target as HTMLInputElement;
                  handleFileSelect(target?.files || null);
               }"
            >

            <div class="flex flex-col items-center gap-2">
               <UIcon
                  name="i-heroicons-photo"
                  class="h-10 w-10 text-gray-400"
               />

               <button
                  type="button"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  :class="{ 'cursor-not-allowed opacity-50': isUploading }"
                  :disabled="isUploading"
                  @click="fileInput?.click()"
               >
                  <span v-if="isUploading">Uploading...</span>
                  <span v-else>{{ label }}</span>
               </button>

               <p class="mt-1 text-xs text-gray-500">
                  Supported formats: {{ accept.map(type => type.split('/')[1]).join(', ') }}
               </p>
               <p class="text-xs text-gray-500">
                  Max size: {{ maxSize }}MB
               </p>
            </div>
         </div>
      </div>
   </div>
</template>
