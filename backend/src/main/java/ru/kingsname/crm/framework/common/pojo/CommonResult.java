package ru.kingsname.crm.framework.common.pojo;

import lombok.Data;
import java.io.Serializable;

/**
 * Standard ruoyi-vue-pro API Response Envelope
 *
 * @param <T> Payload data type
 */
@Data
public class CommonResult<T> implements Serializable {

    /**
     * Error code: 0 represents success, non-zero represents business or security error
     */
    private Integer code;

    /**
     * Response payload data
     */
    private T data;

    /**
     * Response message or error description
     */
    private String msg;

    public static <T> CommonResult<T> success(T data) {
        CommonResult<T> result = new CommonResult<>();
        result.code = 0;
        result.data = data;
        result.msg = "OK";
        return result;
    }

    public static <T> CommonResult<T> success() {
        return success(null);
    }

    public static <T> CommonResult<T> error(Integer code, String message) {
        CommonResult<T> result = new CommonResult<>();
        result.code = code;
        result.msg = message;
        return result;
    }

    public static <T> CommonResult<T> error(String message) {
        return error(500, message);
    }

    public boolean isSuccess() {
        return code != null && code == 0;
    }
}
