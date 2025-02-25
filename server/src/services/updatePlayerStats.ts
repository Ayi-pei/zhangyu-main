

export const updatePlayerStats = async (req: Request, res: Response) => {
    const { userId, reputation, membershipLevel } = req.body;

    // 会员等级规则
    const validMembershipLevels = ['普通', '1星', '2星', '3星', '皇冠'];

    // 输入验证
    if (typeof reputation !== 'number' || reputation < 0) {
        return res.status(400).json({ error: '信誉值不能小于 0' });
    }
    if (!validMembershipLevels.includes(membershipLevel)) {
        return res.status(400).json({ error: '无效的会员等级' });
    }

    try {
        // 只有管理员才能修改
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: '无权限修改玩家数据' });
        }

        // 更新玩家的信誉值和会员等级
        const { data, error } = await supabase
            .from('users')
            .update({ reputation, membership_level: membershipLevel })
            .eq('id', userId);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ message: '玩家数据更新成功', data });
    } catch (error) {
        return res.status(500).json({ error: '服务器内部错误' });
    }
};
