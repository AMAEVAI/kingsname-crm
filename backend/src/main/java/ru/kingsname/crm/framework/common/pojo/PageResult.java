package ru.kingsname.crm.framework.common.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * Standard ruoyi-vue-pro Pagination Result
 *
 * @param <T> Item type
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResult<T> implements Serializable {

    /**
     * Data items list
     */
    private List<T> list;

    /**
     * Total item count
     */
    private Long total;

    public static <T> PageResult<T> empty() {
        return new PageResult<>(List.of(), 0L);
    }
}
