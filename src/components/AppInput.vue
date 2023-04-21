<script setup>
const props = defineProps([
    "label",
    "name",
    "type",
    "model-value",
    "lazy-rules",
    "rules",
    "autocomplete",
    "loading",
    "autofocus",
    "reactiveRules",
    "error",
    "errorMessage",
    "clearable",
    "icon",
    "iconSlot",
    "iconType",
    "iconName",
    "iconColor",
    "onUpdate:modelValue",
    "onHandleIcon",
]);
const emit = defineEmits("update:modelValue", "handleIcon");

const handleInput = (e) => {
    emit("update:modelValue", e);
};

const handleIcon = () => {
    if (props.iconType == "event") {
        emit("handleIcon");
    }
};
</script>
<template>
    <div>
        <q-input
            outlined
            rounded
            hide-bottom-space
            color="blue-grey-2"
            label-color="dark"
            :type="props.type"
            :name="props.name"
            :label="props.label"
            :lazy-rules="props.lazyRules"
            :reactive-rules="props.reactiveRules"
            :rules="props.rules"
            :autocomplete="props.autocomplete"
            :model-value="props.modelValue"
            :loading="props.loading"
            :autofocus="props.autofocus"
            :error="props.error"
            :error-message="props.errorMessage"
            :clearable="props.clearable"
            @update:model-value="handleInput"
        >
            <template
                v-if="props.icon && props.iconSlot == 'append'"
                v-slot:append
            >
                <q-icon
                    :name="props.iconName"
                    :color="props.iconColor"
                    :style="[
                        props.iconType == 'event' ? 'cursor: pointer' : '',
                    ]"
                    @click="handleIcon"
                />
            </template>
            <template
                v-if="props.icon && props.iconSlot == 'prepend'"
                v-slot:prepend
            >
                <q-icon
                    :name="props.iconName"
                    :color="props.iconColor"
                    :style="[
                        props.iconType == 'event' ? 'cursor: pointer' : '',
                    ]"
                    @click="handleIcon"
                />
            </template>
        </q-input>
    </div>
</template>
<style lang="scss" scoped></style>
