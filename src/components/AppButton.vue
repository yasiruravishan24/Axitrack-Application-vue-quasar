<script setup>
const props = defineProps([
    "label",
    "type",
    "color",
    "size",
    "loading",
    "onHandleClick",
]);
const emit = defineEmits("handleClick");

const click = () => {
    emit("handleClick");
};
</script>
<template>
    <q-btn
        rounded
        fab
        :type="props.type"
        :color="props.color"
        :label="props.label"
        :size="props.size"
        :loading="props.loading"
        @click="click"
    >
    </q-btn>
</template>
<style lang="scss" scoped></style>
