<template>
    <div class="license-plate-container">
        <el-input v-model="licensePlate" placeholder="请输入车牌号" @focus="handleInputFocus" ref="plateInput" clearable @clear="clearInput" show-word-limit maxlength="7">
        </el-input>
        
        <!-- 省份选择弹出层 -->
        <el-popover v-model:visible="showProvinceSelect" placement="bottom-start" :width="310" trigger="manual">
            <template #reference>
                <div></div>
            </template>
            <div class="province-grid">
                <el-button v-for="prov in provinces" :key="prov" size="small" @click="selectProvince(prov)">
                    {{ prov }}
                </el-button>
            </div>
        </el-popover>

        <!-- 城市字母选择弹出层 -->
        <el-popover v-model:visible="showCitySelect" placement="bottom-start" :width="310" trigger="manual">
            <template #reference>
                <div></div>
            </template>
            <div class="city-grid">
                <el-button v-for="letter in cityLetters" :key="letter" size="small" @click="selectCity(letter)">
                    {{ letter }}
                </el-button>
            </div>
        </el-popover>

        <!-- 数字字母选择弹出层 -->
        <el-popover v-model:visible="showCharSelect" placement="bottom-start" :width="310" trigger="manual">
            <template #reference>
                <div></div>
            </template>
            <div class="char-grid">
                <el-button v-for="char in allowedChars" :key="char" size="small" @click="selectChar(char)">
                    {{ char }}
                </el-button>
            </div>
        </el-popover>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, defineEmits } from 'vue'

const emit = defineEmits()

const licensePlate = ref('')
const currentPosition = ref(0)
const showProvinceSelect = ref(false)
const showCitySelect = ref(false)
const showCharSelect = ref(false)

const provinces = ['京', '津', '冀', '晋', '蒙', '辽', '吉', '黑', '沪', '苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '桂', '琼', '渝', '川', '贵', '云', '藏', '陕', '甘', '青', '宁', '新']
const cityLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const allowedChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

const handleInputFocus = () => {
    if (licensePlate.value.length === 0) {
        showProvinceSelect.value = true
    } else {
        currentPosition.value = licensePlate.value.length
        if (currentPosition.value === 0) {
            showProvinceSelect.value = true
        } else if (currentPosition.value === 1) {
            showCitySelect.value = true
        } else {
            showCharSelect.value = true
        }
    }
}

const selectProvince = (province) => {
    licensePlate.value = province;
    showProvinceSelect.value = false;
    showCitySelect.value = true;
    currentPosition.value = 1;
};

const selectCity = (city) => {
    licensePlate.value += city;
    showCitySelect.value = false;
    showCharSelect.value = true;
    currentPosition.value = 2;
};

const selectChar = (char) => {
    if (licensePlate.value.length < 7) {
        licensePlate.value += char;
        currentPosition.value += 1;
        if (licensePlate.value.length === 7) {
            ElMessage.success('输入完成');
            showCharSelect.value = false;
            showCitySelect.value = false;
            showProvinceSelect.value = false;
            currentPosition.value = 0
            emit('update:modelValue', licensePlate.value);
        }
    }
};

const clearInput = () => {
    licensePlate.value = '';
    showCharSelect.value = false;
    showCitySelect.value = false;
    showProvinceSelect.value = false;
    currentPosition.value = 0;
    emit('update:modelValue', '');
};
</script>

<style scoped>
.license-plate-container {
    width: 300px;
    position: relative;
}

.el-input__inner {
    padding-right: 140px;
    /* 为输入框右侧留出空间 */
}

.plate-preview {
    color: #999;
    font-size: 14px;
    padding-left: 5px;
}

.province-grid,
.city-grid,
.char-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    /* 增加按钮间隔 */
    padding: 10px;
    align-items: center;
    /* 垂直居中对齐 */
}

.province-grid .el-button,
.city-grid .el-button,
.char-grid .el-button {
    width: 100%;
    /* padding: 8px; */
    margin: 0px 0px 0px 0px;
    text-align: center;
    font-size: 14px;
    border-radius: 4px;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.province-grid .el-button:hover,
.city-grid .el-button:hover,
.char-grid .el-button:hover {
    background-color: #409EFF;
    color: white;
}

.el-popover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.el-popover__arrow {
    border-color: #f5f5f5;
}

@media (max-width: 480px) {

    .province-grid,
    .city-grid,
    .char-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .el-button {
        font-size: 16px;
    }
}
</style>
