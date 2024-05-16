import Dexie from 'dexie'

const db: any = new Dexie('FormDataBase')
db.version(1).stores({ forms: '++id, url, name, formId, formContent, timeStamp' }); // '++id'表示id是自动递增的主键
db.open().catch(error => console.error('Error opening database:', error));

const addFormStorage = async (url: string, name: string, formId: string | number, formContent: any) => {
    const timeStamp = new Date().valueOf()
    try {
        const _form = await db.forms.where({ url, formId }).first();
        if (_form) return new Error('记录已存在')
        const _id = await db.forms.add({ url, name, formId, timeStamp, formContent: JSON.stringify(formContent) });
        console.log(`Form ${_id} added successfully.`);
    } catch (error) {
        console.error('Error adding Form:', error);
    }
}

const getFormStorage = async (url: string, formId: string | number) => {
    try {
        const _form = await db.forms.where({ url, formId }).first();
        if (_form) {
            console.log('Form found:', _form);
            return { ..._form, formContent: JSON.parse(_form.formContent) };
        } else {
            console.log('No Form found with the specified url and formId.');
        }
    } catch (error) {
        console.error('Error getting Form:', error);
    }
}

const editFormStorage = async (url: string, formId: string | number, formContent: any) => {
    const timeStamp = new Date().valueOf()
    try {
        // 查询表单
        const _form = await db.forms.where({ url, formId }).first();

        if (_form) {
            // 用户存在，根据需要更新字段
            const { id } = _form; // 获取用户ID以便更新
            await db.forms.update(id, { timeStamp, formContent: JSON.stringify(formContent) }); // 更新数据
            console.log('User updated successfully.');
        } else {
            console.log('No user found with the specified name and email.');
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

const deleteFormStorage = async (url: string, formId: string | number) => {
    try {
        // 使用where条件查找所有匹配 url 和 formId 的记录
        const deleteQuery = db.forms.where({ url, formId });

        // 计算将要被删除的记录数量，可选步骤，用于确认
        const count = await deleteQuery.count();
        console.log(`Deleting ${count} form with url '${url}' and formId '${formId}'...`);

        // 执行删除操作
        await deleteQuery.delete();
        console.log('Users deleted successfully.');
    } catch (error) {
        console.error('Error deleting form:', error);
    }
}

const deleteFormById = async (id: number) => {
    try {
        // 使用where条件查找所有匹配 id 的记录
        const deleteQuery = db.forms.where({ id });

        // 计算将要被删除的记录数量，可选步骤，用于确认
        const count = await deleteQuery.count();
        console.log(`Deleting ${count} form with id '${id}'...`);

        // 执行删除操作
        await deleteQuery.delete();
        console.log('Users deleted successfully.');
    } catch (error) {
        console.error('Error deleting form:', error);
    }
}

const addOrUpdateFormStorage = async (url: string, name: string, formId: string | number, formContent: any) => {
    const timeStamp = new Date().valueOf()
    try {
        // 查询表单
        const _form = await db.forms.where({ url, formId }).first();

        if (_form) {
            // 用户存在，根据需要更新字段
            const { id } = _form; // 获取用户ID以便更新
            await db.forms.update(id, { timeStamp, formContent: JSON.stringify(formContent) }); // 更新数据
            console.log('User updated successfully.');
        } else {
            const _id = await db.forms.add({ url, name, formId, timeStamp, formContent: JSON.stringify(formContent) });
            console.log(`Form ${_id} added successfully.`);
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

const getAllFormStorage = async () => {
    try {
        const _form = await db.forms.toArray();
        if (_form) {
            console.log('Form found:', _form);
            return { list: _form};
        } else {
            console.log('No Form found with the specified url and formId.');
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

export { addFormStorage, getFormStorage, editFormStorage, deleteFormStorage, addOrUpdateFormStorage, getAllFormStorage, deleteFormById }