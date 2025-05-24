<script setup lang="ts">
import type { Course, CourseImage } from '~~/__backend/courses/types';
import { useDropZone } from '@vueuse/core';
import { FetchError } from 'ofetch';

/* ---------------------------------------------------------------------------------------------- */

const { course } = defineProps<{
   course: Course;
}>();

const emit = defineEmits(['complete']);

const images = computed(() => {
   return course.courseImages;
});

/* ---------------------------------------------------------------------------------------------- */

const toast = useToast();

/* ---------------------------------------------------------------------------------------------- */

const imageUrls = ref<Array<string>>([]);

const dropZoneRef = ref<HTMLDivElement>(null!);

const { isOverDropZone } = useDropZone(dropZoneRef, {
   onDrop,
});

const fileList = ref<File[]>([]);

/* ---------------------------------------------------------------------------------------------- */

/**
 * Handles the image selection through drop-zone
 */
function onDrop(files: File[] | null) {
   if (files && files.length > 0) {
      // fileList.value.push(...files);

      files.forEach((file: File) => {
         imageUrls.value.push(URL.createObjectURL(file));
         fileList.value.push(file);
      });
   }
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Handles the image selection through file-input
 */
function handleFileInputChange(e: Event) {
   const input = e.target as HTMLInputElement;

   const files = Array.from(input.files || []);
   onDrop(files);
}

/* ---------------------------------------------------------------------------------------------- */
/*
 * Uploads the image to server
 */

const isUploading = ref(false);

/**
 * Handler for upload images
 */
async function uploadImage(image: File) {
   const formData = new FormData();
   formData.append('image', image);

   try {
      await useNuxtApp().$api(`/course/${course.id}/image`, {
         method: 'POST',
         body: formData,
      });

      toast.add({
         title: 'Image uploaded',
         description: `${image.name} uploaded`,
         color: 'success',
      });
   }
   catch (error) {
      if (error instanceof FetchError) {
         if (Array.isArray(error.data.message)) {
            toast.add({
               title: 'Image not uploaded',
               description: error.data.message[0].message,
               color: 'error',
            });
         }
      }
      else {
         toast.add({
            title: 'Image not uploaded',
            description: `${image.name} is failed to upload`,
            color: 'error',
         });
      }
   }
}

/**
 * image uploader
 */
async function handleUploadImages() {
   if (fileList.value.length > 0) {
      isUploading.value = true;

      const allPromises: Promise<any>[] = [];

      fileList.value.forEach((file: File) => {
         allPromises.push(uploadImage(file));
      });

      /*
       * cleanup existing files
       */

      Promise.all(allPromises).then(() => {
         emit('complete');
         isUploading.value = false;
      });

      fileList.value = [];
      imageUrls.value = [];
   }
}

/* ---------------------------------------------------------------------------------------------- */
/*
 * Delete image
 */

async function handleDeleteImage(image: CourseImage) {
   try {
      await useNuxtApp().$api(`/course/image/${image.id}`, {
         method: 'DELETE',
      });

      toast.add({
         title: 'Image deleted',
         description: `The image is deleted from the property`,
         color: 'error',
      });

      emit('complete');
   }
   catch (error) {
      console.error(error);
   }
}

/* ---------------------------------------------------------------------------------------------- */
/*
 * Set as primary
 */

async function handleSetAsPrimary(image: Course) {
   try {
      await useNuxtApp().$api(`/course/image/${image.id}/primary`, {
         method: 'PUT',
      });

      toast.add({
         title: 'Status updated',
         description: `Image set as primary`,
         color: 'success',
      });

      emit('complete');
   }
   catch (error) {
      console.error(error);
   }
}

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <section>
      <header class="mb-5">
         <Heading1>Course images</Heading1>
      </header>

      <!-- region: Image upload section -->
      <section class="mb-10">
         <!-- region: Dropzone -->
         <div
            ref="dropZoneRef"
            class="flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed p-10 lg:flex-row"
            :class="
               isOverDropZone ? 'border-first-300 bg-first-100' : 'border-first-200 bg-first-50'
            "
         >
            <input
               class="text-sm text-second-500 file:mr-4 file:rounded-xl file:border-0 file:bg-first-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-first-600 hover:file:bg-first-200"
               type="file"
               accept="image/*"
               @change="handleFileInputChange"
            >

            <div class="flex-1 shrink-0 text-first-400">
               Or drop your images here...
            </div>
         </div>
         <!-- endregion: Dropzone -->

         <!-- region: selected images to upload -->
         <div class="flex flex-col gap-3 p-5">
            <div class="flex w-full justify-center">
               <img
                  v-for="image in imageUrls"
                  :key="image"
                  class="size-64 object-cover"
                  :src="image"
                  alt=""
               >
            </div>

            <div class="flex justify-center">
               <UButton
                  size="xl"
                  :loading="isUploading"
                  @click="handleUploadImages()"
               >
                  Upload selected images
               </UButton>
            </div>
         </div>
         <!-- endregion: selected images to upload -->
      </section>
      <!-- endregion: Image upload section -->

      <!-- region: images -->

      <section>
         <Heading3 class="mb-3">
            Uploaded images
         </Heading3>

         <div
            class="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8"
         >
            <div
               v-for="image in images"
               :key="image.imageUrl"
               class="group relative transition-all"
            >
               <NuxtImg
                  class="aspect-square size-48 object-cover rounded-lg"
                  :src="image.imageUrl"
               />

               <section class="absolute left-1 top-1">
                  <p v-if="image.isPrimary">
                     <UIcon
                        class="text-white"
                        name="i-fa6-solid:star"
                     />
                  </p>
               </section>

               <section class="absolute right-1 top-1 hidden transition-all group-hover:flex gap-1">
                  <UButton
                     square
                     icon="i-fa6-solid:trash-can"
                     color="error"
                     size="xs"
                     @click="handleDeleteImage(image)"
                  />
                  <UButton
                     square
                     size="xs"
                     icon="i-fa6-solid:star"
                     @click="handleSetAsPrimary(image)"
                  />
               </section>
            </div>
         </div>
      </section>

      <!-- endregion: images -->
   </section>
</template>

<style scoped lang="postcss"></style>
