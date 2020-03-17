import { CombinedVueInstance } from "vue/types/vue";
import {
  createLocalVue,
  createWrapper,
  Wrapper,
  WrapperArray
} from "@vue/test-utils";
import Toast, { POSITION } from "@/index";
import VtToast from "@/components/VtToast.vue";
import VtToastContainer from "@/components/VtToastContainer.vue";
import { PluginOptions } from "@/types";

const withGetToasts = <T extends Wrapper<VtToastContainer>>(wrapper: T) => {
  (wrapper as T & { getToasts(): WrapperArray<VtToast> }).getToasts = () =>
    wrapper.findAll(".Vue-Toastification__toast");
  return wrapper as T & { getToasts(): WrapperArray<VtToast> };
};

const loadPlugin = (options?: PluginOptions) => {
  // Isolate vue and container
  const localVue = createLocalVue();
  const container = document.createElement("div");
  let containerComp;
  // Register the plugin and get the container component back
  localVue.use(Toast, {
    container,
    onMounted: containerComponent => (containerComp = containerComponent),
    ...options
  });
  const containerWrapper = createWrapper(
    (containerComp as unknown) as CombinedVueInstance<
      Record<never, unknown> & Vue,
      object,
      object,
      object,
      Record<never, unknown>
    >
  );

  const positionContainers = {
    topLeft: withGetToasts(containerWrapper.find(`.${POSITION.TOP_LEFT}`)),
    topCenter: withGetToasts(containerWrapper.find(`.${POSITION.TOP_CENTER}`)),
    topRight: withGetToasts(containerWrapper.find(`.${POSITION.TOP_RIGHT}`)),
    bottomLeft: withGetToasts(
      containerWrapper.find(`.${POSITION.BOTTOM_LEFT}`)
    ),
    bottomCenter: withGetToasts(
      containerWrapper.find(`.${POSITION.BOTTOM_CENTER}`)
    ),
    bottomRight: withGetToasts(
      containerWrapper.find(`.${POSITION.BOTTOM_RIGHT}`)
    )
  };

  return { localVue, containerWrapper, ...positionContainers };
};

export { loadPlugin };
