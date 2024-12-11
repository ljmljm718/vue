import { updateFile } from '@/api/infra/file';
import Recorder from 'js-audio-recorder';

let recorder = null;
export const record_start = () => {
  if (recorder) return ElMessage.warning('正在录音中');
  recorder = new Recorder({
    sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
    sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
    numChannels: 1 // 声道，支持 1 或 2， 默认是1
  });

  recorder
    .start()
    .then(() => {
      console.log('开始录音');
    })
    .catch((e) => {
      ElMessage.warning('录音失败');
    });
};

export const record_upload = async () => {
  if (!recorder) return;
  const fileForm = new FormData();
  const blob = recorder.getWAVBlob();
  const fileName = `record_${new Date().getTime()}.wav`;
  fileForm.append('file', new File([blob], fileName));
  fileForm.append('path', fileName);
  recorder.destroy().then(() => {
    recorder = null;
  });
  const { data } = await updateFile(fileForm).catch(() => {
    ElMessage.warning('录音上传失败');
  }); // 上传文件
  return data;
};
